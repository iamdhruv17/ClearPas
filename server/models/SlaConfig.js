const mongoose = require('mongoose');

const slaConfigSchema = new mongoose.Schema({
  requestType: { 
    type: String, 
    enum: ['Attendance Correction', 'Event Participation', 'Medical Leave', 'Bonafide Certificate'], 
    required: true 
  },
  slaHours: { type: Number, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' } // Optional: config per department
}, { timestamps: true });

module.exports = mongoose.model('SlaConfig', slaConfigSchema);
