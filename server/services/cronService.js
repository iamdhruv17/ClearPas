const cron = require('node-cron');
const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');
const emailService = require('./emailService');

const initCronJobs = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running SLA Check Cron Job...');
    try {
      const pendingRequests = await Request.find({ status: { $in: ['Pending', 'Under Review'] } });
      const now = new Date();

      for (let req of pendingRequests) {
        if (!req.slaDeadline) continue;

        const timeRemaining = req.slaDeadline - now;
        const totalSlaTime = req.slaDeadline - req.createdAt;
        
        // Calculate percentage of SLA consumed
        const percentageConsumed = 100 - (timeRemaining / totalSlaTime) * 100;

        if (percentageConsumed >= 100 && !req.escalated) {
          // Breached SLA! Escalate
          await escalateRequest(req);
        } else if (percentageConsumed >= 90) {
          // 90% SLA - Urgent Warning
          await createNotification(req.currentAuthorityId, 'Urgent SLA Warning', `Request ${req.type} is about to breach SLA!`);
          // Optionally send email
        } else if (percentageConsumed >= 50 && percentageConsumed < 55) {
          // 50% SLA - Reminder (only trigger once around the 50% mark)
          await createNotification(req.currentAuthorityId, 'SLA Reminder', `Request ${req.type} has consumed 50% of its SLA.`);
        }
      }
    } catch (error) {
      console.error('Error in SLA Cron Job:', error);
    }
  });
};

async function escalateRequest(req) {
  try {
    const currentAuthority = await User.findById(req.currentAuthorityId);
    if (!currentAuthority) return;

    const rolesChain = ['Teacher', 'Coordinator', 'Mentor', 'HOD', 'Dean'];
    const currentIndex = rolesChain.indexOf(currentAuthority.role);
    
    if (currentIndex < rolesChain.length - 1) {
      const nextRole = rolesChain[currentIndex + 1];
      const requestor = await User.findById(req.studentId);
      
      const nextAuthority = await User.findOne({ 
        departmentId: requestor.departmentId, 
        role: nextRole 
      });

      if (nextAuthority) {
        req.currentAuthorityId = nextAuthority._id;
        req.escalated = true;
        req.logs.push({
          action: 'Escalated',
          note: `Automatically escalated to ${nextRole} due to SLA breach.`
        });
        await req.save();

        await createNotification(nextAuthority._id, 'Request Escalated to You', `A ${req.type} request was escalated to you due to SLA breach.`);
        await emailService.sendEmail(nextAuthority.email, 'Request Escalated', `A ${req.type} request was escalated to your queue.`);
      }
    }
  } catch (err) {
    console.error('Escalation error:', err);
  }
}

async function createNotification(userId, title, body) {
  const notif = new Notification({ userId, title, body, type: 'alert' });
  await notif.save();
}

module.exports = { initCronJobs };
