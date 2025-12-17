import { act, renderHook } from '@testing-library/react';
import { AppRoutesPaths } from '@/enums/routes';
import { useLogin } from '@/features/auth/hooks/useLogin';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockLogin = jest.fn();
const mockSetToken = jest.fn();

jest.mock('@/hooks/useApp', () => ({
  useApp: () => ({
    authClient: { login: mockLogin },
    tokenManager: { setToken: mockSetToken },
  }),
}));

describe('useLogin Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle submit with success and redirect', async () => {
    mockLogin.mockResolvedValue({ accessToken: 'xyz' });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('john@doe.com');
      result.current.setPassword('password');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'john@doe.com',
      password: 'password',
      rememberMe: false,
    });
    expect(mockSetToken).toHaveBeenCalledWith('xyz');
    expect(mockNavigate).toHaveBeenCalledWith(AppRoutesPaths.HOME);
  });

  it('should not redirect if login fails (returns undefined)', async () => {
    mockLogin.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(mockSetToken).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
