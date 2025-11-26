import { useState } from 'react';

export const useRememberMe = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  return {
    rememberMe,
    toggleRememberMe,
  };
};
