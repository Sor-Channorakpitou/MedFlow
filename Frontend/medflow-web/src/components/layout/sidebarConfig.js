import {
  LayoutDashboard,
  CalendarDays,
  UserPlus,
  Receipt,
  ClipboardList,
  HeartPulse,
  Users,
  Stethoscope,
  FileText,
  Pill,
  FlaskConical,
  BarChart3,
  UserCog,
  ShieldCheck,
  Settings,
  LogOut,
  HelpCircle,
} from 'lucide-react';

/**
 * Role-specific nav sections.
 * Each role gets a set of groups, each group has a label (optional) and items.
 * Items with isAction:true trigger a handler instead of routing.
 */
export const NAV_CONFIG = {
  RECEPTIONIST: [
    {
      group: 'Workspace',
      items: [
        { id: 'reception-dash',   label: 'Dashboard',         icon: LayoutDashboard, path: '/receptionist' },
        { id: 'reception-arrive', label: 'Arrivals',          icon: CalendarDays,    path: '/receptionist?tab=list' },
        { id: 'reception-reg',    label: 'New Registration',  icon: UserPlus,        path: '/receptionist?tab=register' },
        { id: 'reception-bill',   label: 'Billing Cashier',   icon: Receipt,         path: '/receptionist?tab=checkout' },
      ],
    },
  ],

  NURSE: [
    {
      group: 'Workspace',
      items: [
        { id: 'nurse-dash',  label: 'Dashboard',    icon: LayoutDashboard, path: '/nurse' },
        { id: 'nurse-queue', label: 'Triage Queue', icon: ClipboardList,   path: '/nurse' },
        { id: 'nurse-vitals',label: 'Vitals Entry', icon: HeartPulse,      path: '/nurse' },
      ],
    },
  ],

  DOCTOR: [
    {
      group: 'Workspace',
      items: [
        { id: 'doctor-dash',    label: 'Dashboard',       icon: LayoutDashboard, path: '/doctor' },
        { id: 'doctor-queue',   label: 'Patient Queue',   icon: Users,           path: '/doctor' },
        { id: 'doctor-consult', label: 'Consultations',   icon: Stethoscope,     path: '/doctor' },
        { id: 'doctor-records', label: 'Medical Records', icon: FileText,        path: '/doctor' },
      ],
    },
  ],

  PHARMACIST: [
    {
      group: 'Workspace',
      items: [
        { id: 'pharma-dash',     label: 'Dashboard',        icon: LayoutDashboard, path: '/pharmacist' },
        { id: 'pharma-pending',  label: 'Pending Orders',   icon: ClipboardList,   path: '/pharmacist' },
        { id: 'pharma-dispense', label: 'Dispense',         icon: Pill,            path: '/pharmacist' },
        { id: 'pharma-stock',    label: 'Medication Stock', icon: FlaskConical,    path: '/pharmacist' },
      ],
    },
  ],

  ADMIN: [
    {
      group: 'Analytics',
      items: [
        { id: 'admin-dash',     label: 'Dashboard',          icon: LayoutDashboard, path: '/admin' },
        { id: 'admin-reports',  label: 'Reports',            icon: BarChart3,       path: '/admin' },
      ],
    },
    {
      group: 'Management',
      items: [
        { id: 'admin-staff',    label: 'Staff',              icon: UserCog,         path: '/admin' },
        { id: 'admin-audit',    label: 'Audit & Compliance', icon: ShieldCheck,     path: '/admin' },
      ],
    },
  ],
};

/** Bottom items — same for all roles */
export const BOTTOM_NAV = [
  { id: 'settings', label: 'Settings', icon: Settings,  path: '/settings' },
  { id: 'support',  label: 'Support',  icon: HelpCircle, path: '/support' },
  { id: 'logout',   label: 'Logout',   icon: LogOut,     isAction: 'logout' },
];

/** Role accent colours used for the active state + role badge */
export const ROLE_ACCENT = {
  RECEPTIONIST: { bg: 'bg-blue-50',    text: 'text-blue-700',   icon: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'   },
  NURSE:        { bg: 'bg-purple-50',  text: 'text-purple-700', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  DOCTOR:       { bg: 'bg-emerald-50', text: 'text-emerald-700',icon: 'text-emerald-600',badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500'},
  PHARMACIST:   { bg: 'bg-teal-50',    text: 'text-teal-700',   icon: 'text-teal-600',   badge: 'bg-teal-100 text-teal-700',   dot: 'bg-teal-500'   },
  ADMIN:        { bg: 'bg-amber-50',   text: 'text-amber-700',  icon: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500'  },
};
