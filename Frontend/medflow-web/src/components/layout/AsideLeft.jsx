import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SidebarItem from './SidebarItem';
import { NAV_CONFIG, BOTTOM_NAV, ROLE_ACCENT } from './sidebarConfig';
import icon from '../../assets/icon.png';

const AsideLeft = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [confirmLogout, setConfirmLogout] = useState(false);

  const roleName = user?.role?.name ?? user?.role ?? '';
  const accent = ROLE_ACCENT[roleName] ?? ROLE_ACCENT['ADMIN'];
  const navGroups = NAV_CONFIG[roleName] ?? [];

  const currentPath = location.pathname;

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() ?? '??';

  const handleNav = (item) => {
    if (item.isAction === 'logout') {
      setConfirmLogout(true);
      return;
    }
    // Strip query params for path matching — just navigate to the base path
    navigate(item.path.split('?')[0]);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col shrink-0 select-none">

      {/* ── Brand ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100 shrink-0">
        <img src={icon} alt="MedFlow" className="w-7 h-7 rounded-lg" />
        <div>
          <p className="text-sm font-bold text-slate-900 leading-none">MedFlow</p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Clinical Operations</p>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.group}>
            {/* Group label */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-1.5">
              {group.group}
            </p>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                // Active = current path matches the item's base path
                const isActive = currentPath === item.path.split('?')[0];
                return (
                  <SidebarItem
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    isActive={isActive}
                    accent={accent}
                    onClick={() => handleNav(item)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom section ────────────────────────────────── */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-slate-100 pt-3">
        {BOTTOM_NAV.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={currentPath === item.path}
            accent={accent}
            danger={item.isAction === 'logout'}
            onClick={() => handleNav(item)}
          />
        ))}
      </div>

      {/* ── Profile mini-card ─────────────────────────────── */}
      <button
        onClick={() => navigate('/settings')}
        className="mx-3 mb-4 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors text-left flex items-center gap-3 group"
      >
        {/* Avatar */}
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${accent.badge}`}>
            {initials}
          </div>
        )}

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-none truncate">
            {user?.name ?? 'User'}
          </p>
          <span className={`inline-flex items-center mt-1 gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${accent.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
            {roleName}
          </span>
        </div>

        {/* Settings hint */}
        <svg
          className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Logout confirmation modal ──────────────────────── */}
      {confirmLogout && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs text-center">
            <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Sign out?</h3>
            <p className="text-xs text-slate-500 mb-5">You'll need to log back in to access MedFlow.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AsideLeft;
