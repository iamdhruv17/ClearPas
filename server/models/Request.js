const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  fileType: { type: String },
  aiVerdict: { type: String }, // "Likely Valid", "Needs Review"
  extractedText: { type: String }
});

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const requestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['Attendance Correction', 'Event Participation', 'Medical Leave', 'Bonafide Certificate'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Acknowledged', 'Under Review', 'Approved', 'Rejected', 'Escalated'],
    default: 'Pending'
  },
  reasonRaw: { type: String },
  reasonFormal: { type: String },
  currentAuthorityId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slaDeadline: { type: Date },
  escalated: { type: Boolean, default: false },
  
  // For Medical Leave Phase 2 linked to Phase 1
  intimationId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveIntimation' },
  
  // Embedded subdocuments
  documents: [documentSchema],
  logs: [logSchema]
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
