// src/constants/roles.js
export const ROLES = {
  RECEPTION: 'receptionist',
  NURSE: 'nurse',
  DOCTOR: 'doctor',
  PHARMACIST: 'pharmacist',
  ADMIN: 'admin',
};


export const ROLE_THEMES = {
  [ROLES.RECEPTION]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-50',
    iconColor: 'text-blue-600'
  },
  [ROLES.NURSE]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    hover: 'hover:bg-purple-50',
    iconColor: 'text-purple-600'
  },
  [ROLES.DOCTOR]: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    hover: 'hover:bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  [ROLES.PHARMACIST]: {
    bg: 'bg-[#80eedc]', // Your original mint/teal color
    text: 'text-[#1e3e3b]',
    hover: 'hover:bg-[#a6f3e6]',
    iconColor: 'text-[#1e3e3b]'
  },
  [ROLES.ADMIN]: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    hover: 'hover:bg-amber-50',
    iconColor: 'text-amber-600'
  },
};