import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Structure
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './pages/LoginPage'; // Create a basic file for this if you haven't yet!
import ReceptionistDash from './pages/ReceptionistDash';
import NurseDash from './pages/NurseDash';
import DoctorDash from './pages/DoctorDash';
import PharmacistDash from './pages/PharmacistDash';
import AdminDash from './pages/AdminDash';
import Setting from './pages/Setting';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route: Completely isolated from AsideLeft */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private App Routes wrapped inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/reception" element={<ReceptionistDash />} />
          <Route path="/nurse" element={<NurseDash />} />
          <Route path="/doctor" element={<DoctorDash />} />
          <Route path="/pharmacist" element={<PharmacistDash />} />
          <Route path="/admin" element={<AdminDash />} />
          <Route path="/settings" element={<Setting />} />
        </Route>

        {/* Global Redirect to Login or Reception */}
        <Route path="*" element={<Navigate to="/reception" replace />} />
      </Routes>
    </Router>
  );
}

export default App;