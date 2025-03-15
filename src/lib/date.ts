
export const formatISODate = (date: string | Date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const getRelativeTimeFromNow = (date: string | Date): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSecs < 60) return diffSecs <= 1 ? 'just now' : `${diffSecs} seconds ago`;
  if (diffMins < 60) return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
  if (diffHours < 24) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  if (diffDays < 30) return diffDays === 1 ? 'yesterday' : `${diffDays} days ago`;
  if (diffMonths < 12) return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
};

/**
 * Calculate age from date of birth
 * @param dateOfBirth Date of birth as string or Date object
 * @param asOf Optional date to calculate age as of (defaults to current date)
 * @returns Age in years as a number
 */
export const calculateAge = (dateOfBirth: string | Date, asOf: string | Date = new Date()): number => {
  const birthDate = new Date(dateOfBirth);
  const calculationDate = new Date(asOf);
  
  // Return -1 for invalid dates
  if (isNaN(birthDate.getTime()) || isNaN(calculationDate.getTime())) {
    return -1;
  }
  
  let age = calculationDate.getFullYear() - birthDate.getFullYear();
  
  // Adjust age if birthday hasn't occurred yet this year
  const monthDiff = calculationDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && calculationDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
