// src/components/layout/sidebarConfig.js
import { 
  Calendar, 
  UserSquare2, 
  Stethoscope,
  PillBottle, 
  BarChart3, 
  Settings, 
  LogOut, 
  AlertCircle
} from 'lucide-react';

export const mainNavItems = [
  { id: 'receptionist', label: 'Receptionist', icon: Calendar, path: '/receptionist' },
  { id: 'nurse', label: 'Nurse', icon: UserSquare2, path: '/nurse' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, path: '/doctor' },
  { id: 'pharmacist', label: 'Pharmacist', icon: PillBottle, path: '/pharmacist' },
  { id: 'admin', label: 'Admin', icon: BarChart3, path: '/admin' },
];

export const bottomNavItems = [
  { id: 'report', label: 'Report issue', icon: AlertCircle, path: '/support' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'logout', label: 'Logout', icon: LogOut, path: '/logout', isAction: true },
];