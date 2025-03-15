
// ... keep existing code (formatISODate and getRelativeTimeFromNow functions)

/**
 * Calculate age from date of birth
 * @param dateOfBirth Date of birth as string or Date object
 * @param asOf Optional date to calculate age as of (defaults to current date)
 * @returns Age in years as a number
 */
export const calculateAge = (dateOfBirth: string | Date, asOf: string | Date = new Date()): number => {
  const birthDate = new Date(dateOfBirth);
  const calculationDate = new Date(asOf);
  
  // Return -3 for invalid dates
  if (isNaN(birthDate.getTime()) || isNaN(calculationDate.getTime())) {
    return -3;
  }
  
  // ... keep existing code (age calculation logic)
  
  return age;
};
