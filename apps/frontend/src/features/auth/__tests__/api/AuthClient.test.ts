import { AuthClient } from '@/features/auth/api/AuthClient';
import { TokenManager } from '@/lib/TokenManager';

global.fetch = jest.fn();

describe('AuthClient', () => {
  let client: AuthClient;
  let tokenManager: TokenManager;

  beforeEach(() => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const mockSetAuth = jest.fn();

    tokenManager = new TokenManager(baseUrl, mockSetAuth);
    client = new AuthClient(baseUrl, tokenManager);
    (global.fetch as jest.Mock).mockClear();
  });

  it('login() must call the right endpoint with the right data', async () => {
    const mockData = { email: 'test@test.com', password: '123', rememberMe: true };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: 'fake-token' }),
    });

    await client.login(mockData);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/v1/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockData),
      }),
    );
  });

  it('register() must call the right endpoint with the right data', async () => {
    const mockData = { email: 'test@test.com', password: '123', name: 'test' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: 'fake-token' }),
    });

    await client.register(mockData);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/v1/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockData),
      }),
    );
  });
});
