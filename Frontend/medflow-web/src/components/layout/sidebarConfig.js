// src/components/layout/sidebarConfig.js
import { 
  Calendar, 
  UserSquare2, 
  Stethoscope, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';

export const mainNavItems = [
  { id: 'reception', label: 'Reception', icon: Calendar, path: '/reception' },
  { id: 'nurse', label: 'Nurse', icon: UserSquare2, path: '/nurse' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, path: '/doctor' },
  { id: 'pharmacist', label: 'Pharmacist', icon: Stethoscope, path: '/pharmacist' },
  { id: 'admin', label: 'Executive/Admin', icon: BarChart3, path: '/admin' },
];

export const bottomNavItems = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'logout', label: 'Logout', icon: LogOut, path: '/logout', isAction: true },
];