const BASE_URL = 'https://digital-wedding-back.onrender.com';

let authToken = localStorage.getItem('auth_token') || '';

export const setAuthToken = (token: string) => {
    authToken = token;
    localStorage.setItem('auth_token', token);
};

async function fetchApi(path: string, options: RequestInit = {}) {
    if (authToken) {
        console.log(`DEBUG: Sending request to ${path} with token length ${authToken.length}`);
    } else if (path !== '/api/auth/telegram') {
        console.warn(`DEBUG: Sending request to ${path} WITHOUT token`);
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const status = response.status;
        const statusText = response.statusText;
        const text = await response.text().catch(() => 'No response body');
        console.error(`API Error: ${status} ${statusText}`, text);

        let errorMessage = 'An error occurred';
        try {
            const error = JSON.parse(text);
            errorMessage = error.message || error.error || `Error ${status}: ${statusText}`;
        } catch (e) {
            errorMessage = `Server error (${status}): ${text.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

export const api = {
    // Auth
    authTelegram: async (initData: string) => {
        const result = await fetchApi('/api/auth/telegram', {
            method: 'POST',
            body: JSON.stringify({ initData }),
        });
        if (result.token) {
            setAuthToken(result.token);
        }
        return result;
    },

    // Invitations
    getInvitation: (id: string) => fetchApi(`/api/invitations/${id}`),

    saveInvitation: (data: any) => fetchApi('/api/invitations/init', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    getMyInvitations: () => fetchApi('/api/invitations/self'),

    getCount: () => fetchApi('/api/invitations/self/count'),

    // User
    getUserByTelegramId: (telegramId: string) => fetchApi(`/api/users/by-telegram-id/${telegramId}`),

    healthCheck: () => fetchApi('/health-check'),
};
