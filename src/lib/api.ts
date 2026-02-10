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
        ...(authToken && path !== '/api/auth/telegram' ? {
            'Authorization': `Bearer ${authToken}`,
            'x-auth-token': authToken
        } : {}),
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

        if (status === 401) {
            console.warn("DEBUG: 401 Unauthorized received, clearing token");
            authToken = '';
            localStorage.removeItem('auth_token');
        }

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

        // Aggressive token extraction
        const token = result.token || result.data?.token || result.accessToken;
        if (token) {
            setAuthToken(token);
            console.log("DEBUG: Auth token set successfully");
        } else {
            console.warn("DEBUG: Auth success but NO token found in response", result);
        }
        return result;
    },

    // Invitations
    getInvitation: (id: string) => fetchApi(`/api/invitations/${id}`),

    saveInvitation: (data: any) => {
        // Ensure we don't send empty ID which might confuse backend
        const { id, _id, ...cleanData } = data;
        return fetchApi('/api/invitations/init', {
            method: 'POST',
            body: JSON.stringify(cleanData),
        });
    },

    getMyInvitations: () => fetchApi('/api/invitations/self'),

    getCount: () => fetchApi('/api/invitations/self/count'),

    // User
    getUserByTelegramId: (telegramId: string) => fetchApi(`/api/users/by-telegram-id/${telegramId}`),

    healthCheck: () => fetchApi('/health-check'),
};
