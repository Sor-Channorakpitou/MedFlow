// src/components/layout/AsideLeft.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { mainNavItems, bottomNavItems } from './sidebarConfig';
import { ROLE_THEMES } from '../../constants/roles';

const AsideLeft = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active item based on the current URL path (e.g., "/reception")
  const currentPath = location.pathname;
  
  const handleItemClick = (item) => {
    if (item.isAction) {
      // Clear auth tokens here if necessary
      navigate('/login');
      return;
    }
    navigate(item.path);
  };

  return (
    <aside className="w-64 h-screen bg-[#f8f9fa] border-r border-slate-200 flex flex-col justify-between p-4 font-sans select-none shrink-0">
      <div className="flex flex-col gap-8">
        {/* Brand Identity */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">
            <span className="mt-[-2px]">+</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">MedFlow</h1>
            <p className="text-xs text-slate-500 font-medium">Clinical Ops</p>
          </div>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="flex flex-col gap-1">
          {mainNavItems.map((item) => {
            const isActive = currentPath === item.path;
            // Fallback to pharmacist theme if not specified
            const currentTheme = ROLE_THEMES[item.id] || ROLE_THEMES.pharmacist; 

            return (
              <SidebarItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={isActive}
                theme={currentTheme}
                onClick={() => handleItemClick(item)}
              />
            );
          })}
        </nav>
      </div>

      {/* Settings / Bottom Actions */}
      <div className="flex flex-col gap-1">
        <hr className="border-slate-200 my-2" />
        {bottomNavItems.map((item) => {
          const isActive = currentPath === item.path;
          const defaultTheme = { bg: 'bg-slate-200', text: 'text-slate-900', iconColor: 'text-slate-900' };

          return (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={isActive}
              theme={defaultTheme}
              onClick={() => handleItemClick(item)}
            />
          );
        })}
      </div>
    </aside>
  );
};

export default AsideLeft;