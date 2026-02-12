const BASE_URL = 'https://digital-wedding-back.onrender.com';

let authToken = localStorage.getItem('auth_token') || '';

export const setAuthToken = (token: string) => {
    console.log(`DEBUG: setAuthToken called. Token length: ${token.length}`);
    authToken = token;
    localStorage.setItem('auth_token', token);
};

// Helper to ensure token is fresh (useful during hot reload in dev)
export const getAuthToken = () => {
    // If module token is empty but localStorage has it, reload it
    if (!authToken && localStorage.getItem('auth_token')) {
        authToken = localStorage.getItem('auth_token') || '';
        console.log('DEBUG: Reloaded token from localStorage after hot reload');
    }
    return authToken;
};


async function fetchApi(path: string, options: RequestInit = {}) {
    const currentToken = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(currentToken && path !== '/api/auth/telegram' ? {
            'Authorization': `Bearer ${currentToken}`,
            'x-auth-token': currentToken
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
        } catch {
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
        const token = result.accessToken || result.token || result.data?.token;
        if (token) {
            setAuthToken(token);
            console.log("DEBUG: Auth token set successfully. Length:", token.length);
        } else {
            console.error("DEBUG: Auth success but NO token found in response keys:", Object.keys(result));
            throw new Error("Serverdan kirish kaliti (token) olinmadi. Iltimos, qaytadan urinib ko'ring.");
        }
        return result;
    },

    // Invitations
    getInvitation: async (id: string) => {
        const data = await fetchApi(`/api/invitations/${id}`);
        // Match backend's date format (Instant ISO 8601)
        if (data.date && typeof data.date === 'string' && data.date.includes('T')) {
            try {
                const dateObj = new Date(data.date);
                // Extract just the part before T
                const fullIso = dateObj.toISOString();
                data.date = fullIso.split('T')[0];
                data.time = fullIso.split('T')[1].substring(0, 5);
            } catch (err) {
                console.warn("Failed to parse date from backend", data.date, err);
            }
        }
        return data;
    },

    saveInvitation: (invData: { id?: string | number; _id?: string; date?: string; time?: string;[key: string]: unknown }) => {
        // Ensure we match backend schema for init (usually id: 0 for new)
        const cleanData = { ...invData };

        // If it's a new invitation, backend schema shows id: 0 in example
        if (!cleanData.id && !cleanData._id) {
            cleanData.id = 0;
        } else {
            cleanData.id = cleanData.id || cleanData._id;
        }
        delete cleanData._id; // Backend schema shows 'id'

        // Transform separate date and time into ISO date (Instant)
        if (cleanData.date && typeof cleanData.date === 'string' && cleanData.time && typeof cleanData.time === 'string') {
            // Combine into ISO format: YYYY-MM-DDTHH:mm:00.000Z
            cleanData.date = `${cleanData.date}T${cleanData.time}:00.000Z`;
        } else if (cleanData.date && typeof cleanData.date === 'string') {
            cleanData.date = `${cleanData.date}T00:00:00.000Z`;
        }

        // Mapping for template to match backend enum InvitationTemplate [TEMPLATE_1, TEMPLATE_2]
        const templateMapping: Record<string, string> = {
            'classic': 'TEMPLATE_1',
            'royal_gold': 'TEMPLATE_1',
            'modern_slate': 'TEMPLATE_2',
            'flower': 'TEMPLATE_2',
            'pastel': 'TEMPLATE_1',
            'dark': 'TEMPLATE_2',
            'minimal': 'TEMPLATE_1'
        };

        const currentTemplate = (cleanData.template || cleanData.templateId) as string;
        if (currentTemplate && templateMapping[currentTemplate]) {
            cleanData.template = templateMapping[currentTemplate];
        } else if (currentTemplate && !currentTemplate.startsWith('TEMPLATE_')) {
            cleanData.template = 'TEMPLATE_1';
        }

        // Cleanup: Backend expects 'template' (enum) and 'text'
        delete cleanData.templateId;
        if (cleanData.message) {
            cleanData.text = cleanData.message;
            delete cleanData.message;
        }

        // Mapping for music to match backend enum backgroundMusic
        // If frontend has MUSIC_1, and backend expects it, we keep it.
        // But let's make it robust.
        if (cleanData.backgroundMusic === 'MUSIC_1' || cleanData.backgroundMusic === 'MUSIC_2') {
            // OK
        } else {
            cleanData.backgroundMusic = 'MUSIC_1';
        }

        console.log(`DEBUG: Final saveInvitation payload:`, JSON.stringify(cleanData));


        return fetchApi('/api/invitations/init', {
            method: 'POST',
            body: JSON.stringify(cleanData),
        });
    },

    getMyInvitations: async () => {
        // Backend screenshot shows pageable is required. Defaulting to first 50 items.
        const response = await fetchApi('/api/invitations/self?page=0&size=50');
        console.log("DEBUG: Profile invitations response:", response);
        const list = Array.isArray(response) ? response : (response.content || []);
        return list;
    },

    getCount: () => fetchApi('/api/invitations/self/count'),

    // User
    getUserByTelegramId: (telegramId: string) => fetchApi(`/api/users/by-telegram-id/${telegramId}`),

    healthCheck: () => fetchApi('/health-check'),
};
