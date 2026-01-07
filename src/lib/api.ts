const API_BASE = 'http://localhost:3109';

/**
 * Obtém o accessToken armazenado no localStorage
 */
export function getAccessToken(): string | null {
    try {
        const userData = localStorage.getItem('ratel_user');
        if (userData) {
            const parsed = JSON.parse(userData);
            return parsed.accessToken || null;
        }
    } catch (e) {
        console.error('Erro ao obter token:', e);
    }
    return null;
}

/**
 * Obtém o provedor (google ou microsoft) do usuário logado
 */
export function getProvider(): string | null {
    try {
        const userData = localStorage.getItem('ratel_user');
        if (userData) {
            const parsed = JSON.parse(userData);
            return parsed.provider || null;
        }
    } catch (e) {
        console.error('Erro ao obter provider:', e);
    }
    return null;
}

/**
 * Faz uma requisição autenticada à API
 */
export async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = getAccessToken();
    const provider = getProvider();

    const headers = new Headers(options.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (provider) {
        headers.set('X-Provider', provider);
    }

    return fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
    });
}

export { API_BASE };
