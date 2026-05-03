import { useState, useEffect } from 'react';
import { Settings, Users, Clock, Database, Cpu, Mail, Shield, Save, Plus, Trash2, ChevronRight } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('sla');

  const tabs = [
    { id: 'sla', label: 'SLA Config', icon: Clock },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'system', label: 'System Status', icon: Cpu },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-surface-900 flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-xl shadow-sm">
            <Settings className="h-5 w-5 text-white" />
          </div>
          Admin Control Panel
        </h1>
        <p className="text-sm text-surface-700/60 mt-1">Manage system settings, users, and SLA configurations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-gray-100 pb-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/25'
                  : 'text-surface-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SLA Config Tab */}
      {activeTab === 'sla' && (
        <div className="max-w-2xl stagger">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-base font-bold text-surface-900">SLA Time Limits</h3>
              <p className="text-xs text-surface-700/50 mt-1">Configure the maximum hours before auto-escalation for each request type</p>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { type: 'Attendance Correction', hours: 24, color: 'from-blue-400 to-blue-600' },
                { type: 'Event Participation', hours: 24, color: 'from-violet-400 to-violet-600' },
                { type: 'Medical Leave', hours: 48, color: 'from-rose-400 to-rose-600' },
                { type: 'Bonafide Certificate', hours: 72, color: 'from-emerald-400 to-emerald-600' },
              ].map((item, i) => (
                <div key={i} className="animate-fade-in flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`}></div>
                    <span className="text-sm font-semibold text-surface-900">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={item.hours}
                      className="w-20 border border-gray-200 rounded-lg p-2 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                    />
                    <span className="text-xs text-surface-700/50 font-medium">hours</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-surface-50 border-t border-gray-100">
              <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:bg-primary-700 transition-all text-sm">
                <Save className="h-4 w-4" />
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="max-w-3xl">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-surface-900">Registered Users</h3>
                <p className="text-xs text-surface-700/50 mt-1">Manage user accounts and role assignments</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-sm">
                <Plus className="h-4 w-4" /> Add User
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { name: 'Alice Student', email: 'alice@student.college.edu', role: 'Student' },
                { name: 'Ms. Taylor', email: 'teacher.cs@college.edu', role: 'Teacher' },
                { name: 'Mr. Davis', email: 'coordinator.cs@college.edu', role: 'Coordinator' },
                { name: 'Prof. Johnson', email: 'mentor.cs@college.edu', role: 'Mentor' },
                { name: 'Dr. Smith', email: 'hod.cs@college.edu', role: 'HOD' },
                { name: 'Dr. Dean', email: 'dean@college.edu', role: 'Dean' },
              ].map((u, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-1.5 rounded-full">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900">{u.name}</p>
                      <p className="text-xs text-surface-700/50">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-200">{u.role}</span>
                    <button className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="max-w-2xl stagger">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-base font-bold text-surface-900">System Health</h3>
              <p className="text-xs text-surface-700/50 mt-1">Monitor the status of all backend services</p>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { label: 'MongoDB Atlas', status: 'Online', ok: true, icon: Database },
                { label: 'Gemini AI Service', status: 'Online', ok: true, icon: Cpu },
                { label: 'SLA Cron Worker', status: 'Active', ok: true, icon: Clock },
                { label: 'Email Service (Nodemailer)', status: 'Skipped', ok: false, icon: Mail },
                { label: 'JWT Auth', status: 'Active', ok: true, icon: Shield },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="animate-fade-in flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-surface-100 p-2 rounded-lg">
                        <Icon className="h-4 w-4 text-surface-700" />
                      </div>
                      <span className="text-sm font-semibold text-surface-900">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                      <span className={`text-xs font-semibold ${s.ok ? 'text-emerald-600' : 'text-amber-600'}`}>{s.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
