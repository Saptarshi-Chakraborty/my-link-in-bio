import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return ""
  // Strip all non-digits
  let cleaned = phone.replace(/\D/g, "")
  // If it starts with 00, treat it as a country code prefix indicator and remove it
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2)
  }
  return cleaned
}
