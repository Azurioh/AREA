import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useLogin } from '@/features/auth/hooks/useLogin';
import LoginPage from '@/features/auth/routes/LoginPage';

jest.mock('@/features/auth/hooks/useLogin');
jest.mock('@/shared/hooks/useClearUserData', () => ({
  useClearUserData: jest.fn(),
}));
jest.mock('@/features/auth/hooks/useShowPassword', () => ({
  useShowPassword: jest.fn(() => ({
    showPassword: false,
    togglePasswordVisibility: jest.fn(),
  })),
}));
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) =>
        React.createElement('div', { ...props, ref }, children),
      ),
      span: React.forwardRef(({ children, ...props }: any, ref: any) =>
        React.createElement('span', { ...props, ref }, children),
      ),
    },
    AnimatePresence: ({ children }: any) => children,
  };
});

describe('LoginPage UI', () => {
  const mockSetEmail = jest.fn();
  const mockSetPassword = jest.fn();
  const mockHandleSubmit = jest.fn((e) => e.preventDefault());

  beforeEach(() => {
    (useLogin as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      rememberMe: false,
      setRememberMe: jest.fn(),
      isLoading: false,
      handleSubmit: mockHandleSubmit,
    });
  });

  it('must display the fields and react to typing', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@user.com' } });

    expect(mockSetEmail).toHaveBeenCalledWith('test@user.com');
  });

  it('must call handleSubmit on button click', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    // Trigger form submission directly to verify handler logic
    const submitBtn = screen.getByRole('button', { name: /Sign in/i });
    fireEvent.submit(submitBtn.closest('form')!);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('must display "Signing in..." when isLoading is true', () => {
    (useLogin as jest.Mock).mockReturnValue({
      email: '',
      setEmail: jest.fn(),
      password: '',
      setPassword: jest.fn(),
      rememberMe: false,
      setRememberMe: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: true,
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    expect(screen.getByRole('button', { name: /Signing in.../i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signing in.../i })).toBeDisabled();
  });
});
