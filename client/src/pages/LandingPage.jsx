import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, FileText, Clock, Users, Sparkles, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 glass border-b border-white/20">
        <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 lg:px-8 h-16">
          <div className="flex items-center space-x-2.5">
            <div className="bg-primary-600 p-1.5 rounded-lg shadow-sm">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900 tracking-tight">ClearPass</span>
          </div>
          <Link
            to="/login"
            className="group flex items-center gap-2 text-sm font-semibold text-surface-700 hover:text-primary-600 transition-colors bg-white/60 border border-gray-200 rounded-full px-4 py-2 hover:border-primary-300 hover:bg-primary-50/50"
          >
            Sign in <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-200/40 via-violet-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-primary-100/30 via-sky-100/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          {/* Pill */}
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/60 px-4 py-1.5 text-sm font-medium text-primary-700">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Gemini AI
          </div>
          
          <h1 className="animate-slide-up text-5xl sm:text-7xl font-extrabold tracking-tight text-surface-900 leading-[1.08]">
            Academic approvals,
            <br />
            <span className="gradient-text">accelerated by AI</span>
          </h1>
          
          <p className="animate-slide-up mt-6 mx-auto max-w-2xl text-lg sm:text-xl leading-8 text-surface-700/80" style={{animationDelay: '100ms'}}>
            ClearPass streamlines attendance corrections, medical leaves, and certificate requests.
            Write casually — our AI formats it formally for you.
          </p>

          <div className="animate-slide-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style={{animationDelay: '200ms'}}>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-primary-500/40 transition-all"
            >
              Get Started
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-surface-700 hover:border-primary-300 hover:bg-primary-50/50 transition-all"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-3xl mt-20 px-6">
          <div className="animate-fade-in grid grid-cols-3 gap-8 border border-gray-100 bg-white rounded-2xl p-6 shadow-sm" style={{animationDelay: '350ms'}}>
            <div className="text-center">
              <p className="text-3xl font-extrabold gradient-text">24h</p>
              <p className="text-xs text-surface-700 mt-1 font-medium">Avg. SLA for Attendance</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-3xl font-extrabold gradient-text">7</p>
              <p className="text-xs text-surface-700 mt-1 font-medium">Role-based Access Levels</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold gradient-text">AI</p>
              <p className="text-xs text-surface-700 mt-1 font-medium">Doc Verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Features</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
              Everything you need to manage requests
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-5xl stagger">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: 'AI Text Rewriting', desc: 'Students write casually, Gemini AI instantly converts it into formal language.', color: 'from-amber-400 to-orange-500' },
                { icon: FileText, title: 'Smart Doc Verify', desc: 'Upload medical certs — AI extracts dates and doctor names for instant verification.', color: 'from-emerald-400 to-teal-500' },
                { icon: Clock, title: 'SLA Auto-Escalation', desc: 'Requests auto-escalate to the next authority if deadlines are breached.', color: 'from-primary-400 to-violet-500' },
                { icon: Users, title: '7-Role Workflow', desc: 'Student → Teacher → Coordinator → Mentor → HOD → Dean, fully tracked.', color: 'from-pink-400 to-rose-500' },
              ].map(({ icon: Icon, title, desc, color }, i) => (
                <div key={i} className="animate-slide-up group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-sm mb-4`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-surface-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-surface-700/70">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-surface-700">ClearPass</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 ClearPass. Built with ♥ and Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
