
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Logs a message with a timestamp and optional data
 * @param message The message to log
 * @param data Optional data to log
 */
export function logWithTimestamp(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
}

/**
 * Logs performance metrics for debugging
 * @param label A label for the performance metric
 * @param startTime The start time from performance.now()
 */
export function logPerformance(label: string, startTime: number) {
  const endTime = performance.now();
  const duration = endTime - startTime;
  console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
}

/**
 * Formats a date in a user-friendly way
 * @param date The date to format (Date object or ISO string)
 * @param format The format to use: 'short', 'medium', 'long', or 'relative'
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' | 'relative' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Return empty string for invalid dates
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  // For relative time format (e.g., "2 days ago")
  if (format === 'relative') {
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffSecs < 60) return diffSecs === 1 ? '1 second ago' : `${diffSecs} seconds ago`;
    if (diffMins < 60) return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    if (diffHours < 24) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    if (diffDays < 30) return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    if (diffMonths < 12) return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
    return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
  }
  
  // For standard date formats
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : 'long',
    day: 'numeric',
    hour: format !== 'short' ? 'numeric' : undefined,
    minute: format !== 'short' ? 'numeric' : undefined,
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Calculates BMI (Body Mass Index) from height and weight
 * @param weight Weight in kilograms
 * @param height Height in centimeters
 * @returns BMI value as a number with 1 decimal place, or null if inputs are invalid
 */
export function calculateBMI(weight: number, height: number): number | null {
  // Validate inputs
  if (!weight || !height || weight <= 0 || height <= 0) {
    return null;
  }
  
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // Calculate BMI: weight (kg) / height² (m²)
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Return with 1 decimal place
  return parseFloat(bmi.toFixed(1));
}

/**
 * Gets BMI category based on BMI value
 * @param bmi BMI value
 * @returns Category as string
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obesity (Class 1)';
  if (bmi < 40) return 'Obesity (Class 2)';
  return 'Obesity (Class 3)';
}
