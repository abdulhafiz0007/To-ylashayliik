const BASE_URL = 'https://digital-wedding-back.onrender.com';

let authToken = '';

export const setAuthToken = (token: string) => {
    authToken = token;
};

async function fetchApi(path: string, options: RequestInit = {}) {
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
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || 'Network response was not ok');
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
