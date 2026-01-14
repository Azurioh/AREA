import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatActionReactionName = (name: string): string => {
  return name.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};
