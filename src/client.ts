import fetch from 'isomorphic-fetch';

export interface BoardApiConfig {
  apiKey: string;
  apiToken: string;
  baseUrl?: string;
}

export class BoardApiClient {
  private apiKey: string;
  private apiToken: string;
  private baseUrl: string;

  constructor(config: BoardApiConfig) {
    this.apiKey = config.apiKey;
    this.apiToken = config.apiToken;
    this.baseUrl = config.baseUrl || 'https://api.the-board.jp/v1';
  }

  async request<T>(
    path: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    data?: any,
    queryParams?: Record<string, string | number | boolean>
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;
    
    // クエリパラメータの追加
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, value.toString());
      });
      url = `${url}?${params.toString()}`;
    }

    const headers: HeadersInit = {
      'x-api-key': this.apiKey,
      'Authorization': `Bearer ${this.apiToken}`,
    };

    if (method !== 'GET' && data) {
      headers['Content-Type'] = 'application/json';
    }

    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API リクエストエラー: ${response.status} ${response.statusText}\n${errorText}`);
    }

    return response.json() as Promise<T>;
  }
} 