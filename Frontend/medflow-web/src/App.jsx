// Example of how your dashboard routes should be structured in App.jsx or a MainLayout.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AsideLeft from './components/layout/AsideLeft';
import ReceptionistDash from './pages/ReceptionistDash';
import NurseDash from './pages/NurseDash';
import DoctorDash from './pages/DoctorDash';
import PharmacistDash from './pages/PharmacistDash';
import AdminDash from './pages/AdminDash';
import Setting from './pages/Setting';


function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
        {/* Sidebar remains fixed on the left */}
        <AsideLeft />

        {/* Dynamic workspace area on the right */}
        <main className="flex-1 h-full overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/reception" replace />} />
            <Route path="/reception" element={<ReceptionistDash />} />
                <Route path="/nurse" element={<NurseDash />} />
                  <Route path="/doctor" element={<DoctorDash />} />
                  <Route path="/pharmacist" element={<PharmacistDash />} />
                  <Route path="/admin" element={<AdminDash />} /> 
                  <Route path="/settings" element={<Setting />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;