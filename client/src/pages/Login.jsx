import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const testAccounts = [
  { label: 'Student', email: 'alice@student.college.edu' },
  { label: 'Teacher', email: 'teacher.cs@college.edu' },
  { label: 'Coordinator', email: 'coordinator.cs@college.edu' },
  { label: 'Admin', email: 'admin@college.edu' },
];

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (acctEmail) => {
    setEmail(acctEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-violet-800 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-md">
          <div className="bg-white/10 p-3 rounded-xl inline-flex mb-8">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Simplify your academic requests
          </h1>
          <p className="mt-4 text-lg text-white/70 leading-relaxed">
            One platform for attendance corrections, medical leaves, and certificates. AI-powered, SLA-tracked, and fully transparent.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { num: '7', label: 'User Roles' },
              { num: 'AI', label: 'Doc Verify' },
              { num: '24h', label: 'Avg. SLA' },
              { num: '100%', label: 'Transparent' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-extrabold text-white">{s.num}</p>
                <p className="text-xs text-white/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface-50">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-surface-700 hover:text-primary-600 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-surface-900">Welcome back</h2>
            <p className="mt-1 text-sm text-surface-700/70">Sign in to access your dashboard</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-surface-900 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-surface-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-900 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-surface-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-primary-500/40 transition-all disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Quick Login */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-3">Quick Login (Demo)</p>
            <div className="grid grid-cols-2 gap-2">
              {testAccounts.map((a) => (
                <button
                  key={a.email}
                  onClick={() => quickLogin(a.email)}
                  className="text-left px-3 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 transition-all text-xs"
                >
                  <p className="font-semibold text-surface-900">{a.label}</p>
                  <p className="text-gray-400 truncate mt-0.5">{a.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
