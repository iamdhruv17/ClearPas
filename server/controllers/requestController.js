const Request = require('../models/Request');
const SlaConfig = require('../models/SlaConfig');
const User = require('../models/User');
const aiService = require('../services/aiService');

exports.createRequest = async (req, res) => {
  try {
    const { type, reasonRaw } = req.body;
    
    // Rewrite reason
    const reasonFormal = await aiService.rewriteReason(reasonRaw, type);
    
    // Find SLA config
    const slaConfig = await SlaConfig.findOne({ requestType: type });
    const slaHours = slaConfig ? slaConfig.slaHours : 24;
    
    // Set SLA deadline
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + slaHours);

    // Initial Authority is Teacher for basic requests, Coordinator for others
    const user = await User.findById(req.user.id);
    let initialAuthorityRole = 'Teacher';
    if (type === 'Bonafide Certificate' || type === 'Medical Leave') {
      initialAuthorityRole = 'Coordinator';
    }

    const authority = await User.findOne({ 
      departmentId: user.departmentId, 
      role: initialAuthorityRole 
    });

    const newRequest = new Request({
      studentId: req.user.id,
      type,
      reasonRaw,
      reasonFormal,
      currentAuthorityId: authority ? authority._id : null,
      slaDeadline,
      logs: [{
        action: 'Created',
        actorId: req.user.id,
        note: 'Request submitted'
      }]
    });

    // Handle uploaded file if any
    if (req.file) {
      newRequest.documents.push({
        fileUrl: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype
      });
    }

    await newRequest.save();
    
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const { role, id } = req.user;
    
    let query = {};
    if (role === 'Student') {
      query.studentId = id;
    } else if (role !== 'Admin') {
      query.currentAuthorityId = id;
    }

    const requests = await Request.find(query)
      .populate('studentId', 'name email classId')
      .populate('currentAuthorityId', 'name role')
      .sort({ createdAt: -1 })
      .lean();

    let allRequests = requests;

    if (role === 'Student') {
      const LeaveIntimation = require('../models/LeaveIntimation');
      const intimations = await LeaveIntimation.find({ studentId: id })
        .populate('coordinatorId', 'name role')
        .sort({ createdAt: -1 })
        .lean();
        
      const mappedIntimations = intimations.map(int => ({
        _id: int._id,
        type: 'Medical Leave (Phase 1)',
        status: int.status,
        createdAt: int.createdAt,
        currentAuthorityId: int.coordinatorId,
        isIntimation: true
      }));
      
      allRequests = [...requests, ...mappedIntimations].sort((a, b) => b.createdAt - a.createdAt);
    }

    res.json(allRequests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateRequestAction = async (req, res) => {
  try {
    const { action, remark } = req.body; // 'Approve', 'Reject', 'Forward'
    const requestId = req.params.id;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Validate authority
    if (request.currentAuthorityId.toString() !== req.user.id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to act on this request' });
    }

    const logEntry = {
      action,
      actorId: req.user.id,
      note: remark
    };
    
    if (action === 'Approve') {
      request.status = 'Approved';
    } else if (action === 'Reject') {
      request.status = 'Rejected';
    } else if (action === 'Forward') {
      // Find next authority in chain
      const rolesChain = ['Teacher', 'Coordinator', 'Mentor', 'HOD', 'Dean'];
      const currentIndex = rolesChain.indexOf(req.user.role);
      
      if (currentIndex < rolesChain.length - 1) {
        const nextRole = rolesChain[currentIndex + 1];
        const requestor = await User.findById(request.studentId);
        
        const nextAuthority = await User.findOne({ 
          departmentId: requestor.departmentId, 
          role: nextRole 
        });

        if (nextAuthority) {
          request.currentAuthorityId = nextAuthority._id;
          request.status = 'Under Review';
          // Reset SLA for new authority? Or keep original? Let's keep original for overall SLA, but maybe extend it.
        }
      }
    }

    request.logs.push(logEntry);
    await request.save();

    res.json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
