const mongoose = require('mongoose');

const leaveIntimationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reasonRaw: { type: String, required: true },
  reasonFormal: { type: String },
  docDeadline: { type: Date }, // Usually toDate + 3 days
  status: {
    type: String,
    enum: ['Acknowledged', 'Documents Submitted', 'Verified', 'Approved', 'Revoked'],
    default: 'Acknowledged'
  },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('LeaveIntimation', leaveIntimationSchema);
