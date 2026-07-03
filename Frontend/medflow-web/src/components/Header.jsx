// components/layout/Header.jsx
import React, { useEffect, useState } from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getUserById } from '../services/userAPI';
import { getCurrentUser } from '../services/authAPI';

export default function Header({ 
    searchPlaceholder = "Search...",
    searchValue = "",
    onSearchChange,
    showSearch = true,
    hasNotifications = true
}) {
  const { user } = useAuth();

  
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 w-full shrink-0">
      
      {/* Universal Search (Conditional based on role context) */}
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

      {/* Actions & Profile Dynamic Injection */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-slate-600 hover:text-slate-900 transition-colors">
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        {/* Global User Session Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            {user?.profileImage? 
            ( <img src={user?.profileImage} alt="profile" className='w-10 h-10 rounded-full' /> )
            : 
            ( <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center font-bold text-teal-800 text-sm border border-teal-100">
                {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2)}
                {console.log(user?.profileImage)}
              </div>
            )}
            
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name}</p>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">{user?.role.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}