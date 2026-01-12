import { Check, X } from 'lucide-react';
import type { PasswordCriteria } from '@/features/auth/hooks/usePasswordValidation';

interface PasswordStrengthBarProps {
  criteria: PasswordCriteria;
  strength: number;
}

export function PasswordStrengthBar({ criteria, strength }: PasswordStrengthBarProps) {
  const getStrengthColor = () => {
    if (strength < 40) {
      return 'bg-destructive';
    }
    if (strength < 80) {
      return 'bg-yellow-300';
    }
    return 'bg-green-500';
  };

  const criteriaList = [
    { key: 'minLength', label: 'Au minimum 12 caractères', valide: criteria.minLength },
    { key: 'hasUpperCase', label: 'Au moins une majuscule', valide: criteria.hasUpperCase },
    { key: 'hasLowerCase', label: 'Au moins une minuscule', valide: criteria.hasLowerCase },
    { key: 'hasNumber', label: 'Au moins un chiffre', valide: criteria.hasNumber },
    { key: 'hasSpecialChar', label: 'Au moins un caractère spécial', valide: criteria.hasSpecialChar },
  ];

  return (
    <div className="space-y-2 mt-2">
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${getStrengthColor()}`} style={{ width: `${strength}%` }} />
      </div>
      <ul className="space-y-1 text-xs">
        {criteriaList.map((critere) => (
          <li
            key={critere.key}
            className={`flex items-center gap-2 ${critere.valide ? 'text-green-600' : 'text-muted-foreground'}`}
          >
            {critere.valide ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            <span>{critere.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
