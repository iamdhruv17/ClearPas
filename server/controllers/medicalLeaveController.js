const LeaveIntimation = require('../models/LeaveIntimation');
const Request = require('../models/Request');
const User = require('../models/User');
const SlaConfig = require('../models/SlaConfig');
const aiService = require('../services/aiService');
const fs = require('fs');
const path = require('path');

exports.createIntimation = async (req, res) => {
  try {
    const { fromDate, toDate, reasonRaw } = req.body;
    
    const reasonFormal = await aiService.rewriteReason(reasonRaw, 'Medical Leave Intimation');
    
    // Find coordinator for the student's department
    const student = await User.findById(req.user.id);
    const coordinator = await User.findOne({ departmentId: student.departmentId, role: 'Coordinator' });
    
    const docDeadline = new Date(toDate);
    docDeadline.setDate(docDeadline.getDate() + 3); // Return date + 3 days

    const newIntimation = new LeaveIntimation({
      studentId: req.user.id,
      fromDate,
      toDate,
      reasonRaw,
      reasonFormal,
      docDeadline,
      status: 'Acknowledged',
      coordinatorId: coordinator ? coordinator._id : null
    });

    await newIntimation.save();
    res.status(201).json(newIntimation);
  } catch (error) {
    console.error('Error creating intimation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.submitDocuments = async (req, res) => {
  try {
    const intimationId = req.params.id;
    const intimation = await LeaveIntimation.findById(intimationId);
    
    if (!intimation) return res.status(404).json({ message: 'Intimation not found' });
    if (intimation.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Document is required' });
    }

    // Convert file to base64 for Gemini multimodal
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Image = fileBuffer.toString('base64');
    
    // Run AI OCR & Verdict
    const aiResult = await aiService.analyzeMedicalDocument(base64Image, req.file.mimetype);

    intimation.status = 'Documents Submitted';
    await intimation.save();

    // Find SLA config
    const slaConfig = await SlaConfig.findOne({ requestType: 'Medical Leave' });
    const slaHours = slaConfig ? slaConfig.slaHours : 48;
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + slaHours);

    // Create the actual Request object for the authority queue
    const newRequest = new Request({
      studentId: req.user.id,
      type: 'Medical Leave',
      status: 'Pending',
      reasonRaw: intimation.reasonRaw,
      reasonFormal: intimation.reasonFormal,
      currentAuthorityId: intimation.coordinatorId,
      slaDeadline,
      intimationId: intimation._id,
      documents: [{
        fileUrl: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        aiVerdict: aiResult.verdict,
        extractedText: aiResult.extractedText
      }],
      logs: [{
        action: 'Documents Submitted',
        actorId: req.user.id,
        note: `AI Verdict: ${aiResult.verdict}`
      }]
    });

    await newRequest.save();

    res.json(newRequest);
  } catch (error) {
    console.error('Error submitting documents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
