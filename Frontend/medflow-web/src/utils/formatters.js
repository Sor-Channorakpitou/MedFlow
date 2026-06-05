// src/utils/formatters.js

/**
 * Formats standard ISO dates or timestamps from the database into clean strings.
 * Example: "2026-06-05T16:00:00Z" -> "Jun 5, 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats database numeric fields into USD currency values for invoices.
 * Example: 45.5 -> "$45.50"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Converts a patient's date of birth string into an active age.
 */
export const calculateAge = (dobString) => {
  if (!dobString) return 'N/A';
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};