
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

/**
 * Calculates daily calorie needs based on weight, height, age, gender, and activity level
 * @param weight Weight in kilograms
 * @param height Height in centimeters
 * @param age Age in years
 * @param gender 'male' or 'female'
 * @param activityLevel Activity level from 1 (sedentary) to 5 (very active)
 * @returns Daily calorie needs
 */
export function calculateDailyCalories(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 1 | 2 | 3 | 4 | 5
): number {
  // Validate inputs
  if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
    return 0;
  }
  
  // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;
  
  // Activity multipliers
  const activityMultipliers = {
    1: 1.2,   // Sedentary (little or no exercise)
    2: 1.375, // Lightly active (light exercise/sports 1-3 days/week)
    3: 1.55,  // Moderately active (moderate exercise/sports 3-5 days/week)
    4: 1.725, // Very active (hard exercise/sports 6-7 days a week)
    5: 1.9    // Extra active (very hard exercise, physical job or training twice a day)
  };
  
  // Calculate total daily energy expenditure (TDEE)
  const tdee = bmr * activityMultipliers[activityLevel];
  
  // Return rounded value
  return Math.round(tdee);
}

/**
 * Calculates ideal weight range based on height using the BMI method
 * @param height Height in centimeters
 * @returns Object with min and max ideal weight in kilograms
 */
export function calculateIdealWeightRange(height: number): { min: number; max: number } | null {
  // Validate input
  if (!height || height <= 0) {
    return null;
  }
  
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // Calculate weight range for BMI between 18.5 (min healthy) and 24.9 (max healthy)
  const minWeight = 18.5 * (heightInMeters * heightInMeters);
  const maxWeight = 24.9 * (heightInMeters * heightInMeters);
  
  // Return with 1 decimal place
  return {
    min: parseFloat(minWeight.toFixed(1)),
    max: parseFloat(maxWeight.toFixed(1))
  };
}

/**
 * Formats a number as a weight with the appropriate unit
 * @param weight Weight value
 * @param unit Unit to use ('kg' or 'lb')
 * @returns Formatted weight string
 */
export function formatWeight(weight: number, unit: 'kg' | 'lb' = 'kg'): string {
  if (!weight && weight !== 0) return '';
  
  if (unit === 'lb') {
    // Convert kg to lb if needed
    const weightInLb = weight * 2.20462;
    return `${weightInLb.toFixed(1)} lb`;
  }
  
  return `${weight.toFixed(1)} kg`;
}

/**
 * Formats a number as a height with the appropriate unit
 * @param height Height value in cm
 * @param unit Unit to use ('cm' or 'ft')
 * @returns Formatted height string
 */
export function formatHeight(height: number, unit: 'cm' | 'ft' = 'cm'): string {
  if (!height && height !== 0) return '';
  
  if (unit === 'ft') {
    // Convert cm to feet and inches
    const totalInches = height / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
  
  return `${height} cm`;
}

/**
 * Generates a color based on a value within a range
 * Useful for visualizing metrics like BMI, body fat percentage, etc.
 * @param value Current value
 * @param min Minimum value in the range
 * @param max Maximum value in the range
 * @param lowIsGood Whether lower values are better (true) or higher values are better (false)
 * @returns Hex color code
 */
export function getMetricColor(
  value: number,
  min: number,
  max: number,
  lowIsGood: boolean = false
): string {
  // Validate inputs
  if (value < min) value = min;
  if (value > max) value = max;
  
  // Normalize the value to a 0-1 range
  const normalizedValue = (value - min) / (max - min);
  
  // Invert if lower values are better
  const adjustedValue = lowIsGood ? 1 - normalizedValue : normalizedValue;
  
  // Generate RGB values
  // Red to yellow to green: (255,0,0) -> (255,255,0) -> (0,255,0)
  let r, g;
  if (adjustedValue < 0.5) {
    // Red to yellow
    r = 255;
    g = Math.round(adjustedValue * 2 * 255);
  } else {
    // Yellow to green
    r = Math.round((1 - adjustedValue) * 2 * 255);
    g = 255;
  }
  
  // Convert to hex
  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  
  return `#${rHex}${gHex}00`;
}
