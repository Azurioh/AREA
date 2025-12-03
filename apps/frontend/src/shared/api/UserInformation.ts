const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export class UserInformationClient {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  async getUserInformation(): Promise<any> {
    const url = `${this.baseURL}/users/v1/me`;
    const token = localStorage.getItem('accessToken');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user information');
    }

    const data = await response.json();
    return data;
  }
}
