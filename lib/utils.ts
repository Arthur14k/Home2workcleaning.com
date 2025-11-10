import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Safely merge Tailwind + conditional classes
 * NOTE: this is the official shadcn recommended util
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
