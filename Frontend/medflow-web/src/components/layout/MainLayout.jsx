import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AsideLeft from './AsideLeft';

function MainLayout() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };


  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
    <button
      onClick={() => setShowSidebar(!showSidebar)}
      className={`fixed top-4 ${showSidebar ? "left-[275px]" : "left-5"} z-50 rounded-lg bg-white p-2 shadow`}
    >
      <Menu />
    </button>
      {/* Sidebar now only exists inside authenticated pages */}
        {showSidebar && (<AsideLeft 
          onLogout={handleLogout} 
        />) }
      {/* Dynamic workspace area on the right */}
      <main className="flex-1 h-full overflow-y-auto pl-20">
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout;