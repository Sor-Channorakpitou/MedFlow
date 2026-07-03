import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AsideLeft from './AsideLeft';

function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Sidebar now only exists inside authenticated pages */}
      <AsideLeft onLogout={handleLogout} />

      {/* Dynamic workspace area on the right */}
      <main className="flex-1 h-full overflow-y-auto p-6">
        <Outlet /> 
      </main>
    </div>
  );
}

export default MainLayout;