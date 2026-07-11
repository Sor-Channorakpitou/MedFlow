import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

export default function Header({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  showSearch = true,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 w-full shrink-0">

      {/* Search */}
      <div className="relative w-full max-w-xl">
        {showSearch && (
          <>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-slate-100 text-sm pl-10 pr-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-slate-300 transition-all text-slate-800"
            />
          </>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">

        {/* Live notification bell — socket-driven, no DB needed */}
        <NotificationBell />

        {/* Profile — click routes to /settings */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity"
          aria-label="Go to profile settings"
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="profile"
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center font-bold text-teal-800 text-sm border border-teal-100 shrink-0">
              {initials}
            </div>
          )}
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</p>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              {user?.role?.name ?? user?.role}
            </span>
          </div>
        </button>

      </div>
    </header>
  );
}
