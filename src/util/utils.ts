// Library imports
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Helper funtion to merge class names.
 * 
 * @param inputs The class names to merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}