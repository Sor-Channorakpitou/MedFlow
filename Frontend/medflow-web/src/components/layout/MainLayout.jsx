import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AsideLeft from './AsideLeft';


function MainLayout() {

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f6f8]">
      {/* Persistent sidebar — always visible, no toggle */}
      <AsideLeft />

      {/* Page content */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col min-w-0">
        <Outlet  />
      </main>
    </div>
  );
}

export default MainLayout;
