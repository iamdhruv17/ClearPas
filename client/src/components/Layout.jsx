import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, Bell, User as UserIcon, ShieldCheck, X } from 'lucide-react';
import api from '../services/api';

export default function Layout({ user, setUser }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) { /* silent */ }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) { /* silent */ }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/dashboard" className="flex items-center space-x-2.5 group">
              <div className="bg-primary-600 p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900 tracking-tight">ClearPass</span>
            </Link>
            <div className="flex items-center space-x-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {/* Notification Dropdown */}
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-scale-in overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <h3 className="text-sm font-semibold text-surface-900">Notifications</h3>
                      <button onClick={() => setShowNotifs(false)}>
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-sm text-gray-400">No notifications yet</p>
                      ) : (
                        notifications.slice(0, 8).map(n => (
                          <div
                            key={n._id}
                            onClick={() => markRead(n._id)}
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-primary-50/50' : ''}`}
                          >
                            <p className="text-sm font-medium text-surface-900">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-gray-200"></div>

              {/* User Info */}
              <div className="flex items-center space-x-2.5">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-1.5 rounded-full shadow-sm">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-surface-900 leading-tight">{user.name}</p>
                  <p className="text-[11px] text-primary-600 font-medium">{user.role}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
