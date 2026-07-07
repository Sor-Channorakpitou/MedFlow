import React from 'react';

const SidebarItem = ({ label, icon: Icon, isActive, onClick, theme }) => {
  return (
    <button
      onClick={onClick}
      title={label} 
      className={`w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-left font-medium
        ${isActive 
          ? `${theme.bg} ${theme.text} shadow-sm` 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? theme.iconColor : 'text-slate-500'}`} />
      <span className="text-sm hidden lg:block whitespace-nowrap">{label}</span>
    </button>
  );
};

export default SidebarItem;