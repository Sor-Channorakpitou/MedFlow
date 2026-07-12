const SidebarItem = ({ label, icon: Icon, isActive, onClick, accent, danger = false, isExpanded = true }) => {
  if (danger) {
    return (
      <button
        onClick={onClick}
        title={!isExpanded ? label : undefined} // Shows a native browser tooltip if collapsed
        className={`flex items-center rounded-lg text-left transition-all group text-rose-500 hover:bg-rose-50
          ${isExpanded ? 'w-full gap-3 px-3 py-2' : 'w-10 h-10 justify-center mx-auto'}`}
      >
        <Icon className="w-4 h-4 shrink-0 text-rose-400 group-hover:text-rose-600" />
        {isExpanded && <span className="text-sm font-medium">{label}</span>}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      title={!isExpanded ? label : undefined}
      className={`flex items-center rounded-lg text-left transition-all group
        ${isExpanded ? 'w-full gap-3 px-3 py-2' : 'w-10 h-10 justify-center mx-auto'}
        ${isActive
          ? `${accent?.bg ?? 'bg-slate-100'} ${accent?.text ?? 'text-slate-900'} font-semibold`
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
        }`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 transition-colors
          ${isActive
            ? accent?.icon ?? 'text-slate-700'
            : 'text-slate-400 group-hover:text-slate-600'
          }`}
      />
      {isExpanded && <span className="text-sm">{label}</span>}
    </button>
  );
};

export default SidebarItem;