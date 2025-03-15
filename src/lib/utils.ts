
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
