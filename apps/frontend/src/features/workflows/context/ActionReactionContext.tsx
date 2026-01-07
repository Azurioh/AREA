import { createContext, useContext } from 'react';
import { useCreateActionReaction } from '@/features/workflows/hooks/useCreateActionReaction';

const ActionReactionContext = createContext<ReturnType<typeof useCreateActionReaction> | null>(null);

export const ActionReactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useCreateActionReaction();
  return <ActionReactionContext.Provider value={value}>{children}</ActionReactionContext.Provider>;
};

export const useActionReaction = () => {
  const ctx = useContext(ActionReactionContext);
  if (!ctx) {
    throw new Error('useActionReaction must be used inside ActionReactionProvider');
  }
  return ctx;
};
