import type React from 'react';
import { createContext, type ReactNode, useMemo, useState } from 'react';

/**
 * @interface ReloadContextType
 * @description Reload context type
 */
export interface ReloadContextType {
  serviceConnectionReload: number;
  triggerServiceConnectionReload: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ReloadContext = createContext<ReloadContextType | undefined>(undefined);

export const ReloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serviceConnectionReload, setServiceConnectionReload] = useState<number>(0);

  const triggerServiceConnectionReload = () => {
    setServiceConnectionReload((prev) => prev + 1);
  };

  const contextValue = useMemo(
    () => ({
      serviceConnectionReload,
      triggerServiceConnectionReload,
    }),
    [serviceConnectionReload],
  );

  return <ReloadContext.Provider value={contextValue}>{children}</ReloadContext.Provider>;
};
