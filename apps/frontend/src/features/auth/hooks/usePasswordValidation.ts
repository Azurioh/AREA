import { useMemo } from 'react';

export interface PasswordCriteria {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function usePasswordValidation(password: string) {
  const criteria = useMemo<PasswordCriteria>(() => {
    return {
      minLength: password.length >= 12,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const strength = useMemo(() => {
    const metCriteria = Object.values(criteria).filter(Boolean).length;
    return (metCriteria / 5) * 100;
  }, [criteria]);

  const isValid = useMemo(() => {
    return Object.values(criteria).every(Boolean);
  }, [criteria]);

  return { criteria, strength, isValid };
}
