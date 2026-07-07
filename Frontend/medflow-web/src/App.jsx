
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WorkflowProvider } from './context/WorkflowContext';
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './pages/LoginPage'; 
import ReceptionistDash from './pages/ReceptionistDash';
import NurseDash from './pages/NurseDash';
import DoctorDash from './pages/DoctorDash';
import PharmacistDash from './pages/PharmacistDash';
import AdminDash from './pages/AdminDash';
import Setting from './pages/Setting';
import { AuthProvider } from './context/authContext';
import RoleRoute from './components/RoleProtection';
import MedflowSupport from './components/MedflowSupport';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    
    <AuthProvider>
      <SocketProvider>
        <Router>
          <WorkflowProvider>
            <Routes>

              {/* Public */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected */}
              <Route element={<ProtectedRoute />}>

                {/* Only apply after authenticated */}
                <Route element={<MainLayout />}>

                  {/* RBAC */}
                  <Route element={<RoleRoute allowedRoles={["RECEPTIONIST"]} />}>
                    <Route path="/receptionist" element={<ReceptionistDash />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={["NURSE"]} />}>
                    <Route path="/nurse" element={<NurseDash />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={["DOCTOR"]} />}>
                    <Route path="/doctor" element={<DoctorDash />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={["PHARMACIST"]} />}>
                    <Route path="/pharmacist" element={<PharmacistDash />} />
                  </Route>

                  <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                    <Route path="/admin" element={<AdminDash />} />
                  </Route>

                  <Route path="/settings" element={<Setting />} />
                  <Route path="/support" element={<MedflowSupport />} />

                </Route>
              </Route>

              {/* Global Redirect to Login */}
              <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
          </WorkflowProvider>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;