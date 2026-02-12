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

    const text = await response.text().catch(() => '');
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text; // Return as plain text if not JSON
    }
}

// Mappings
const templateMapping: Record<string, string> = {
    'classic': 'TEMPLATE_1',
    'royal_gold': 'TEMPLATE_1',
    'modern_slate': 'TEMPLATE_2',
    'flower': 'TEMPLATE_2',
    'pastel': 'TEMPLATE_1',
    'dark': 'TEMPLATE_2',
    'minimal': 'TEMPLATE_1'
};

const reverseTemplateMapping: Record<string, string> = {
    'TEMPLATE_1': 'classic',
    'TEMPLATE_2': 'modern_slate'
};

const reverseMusicMapping: Record<string, string> = {
    'MUSIC_1': 'MUSIC_1',
    'MUSIC_2': 'MUSIC_2'
};

const mapBackendToFrontend = (data: any) => {
    if (!data || typeof data !== 'object') return data;
    const mapped = { ...data };

    // Ensure id is always present
    mapped.id = mapped.id || mapped._id;

    // Map template enum back to frontend id
    if (mapped.template && reverseTemplateMapping[mapped.template]) {
        mapped.template = reverseTemplateMapping[mapped.template];
    }

    // Map music enum back to frontend id
    if (mapped.backgroundMusic && reverseMusicMapping[mapped.backgroundMusic]) {
        mapped.backgroundMusic = reverseMusicMapping[mapped.backgroundMusic];
    }

    // Date/Time parsing back to frontend format (YYYY-MM-DD and HH:mm)
    if (mapped.date && typeof mapped.date === 'string' && mapped.date.includes('T')) {
        try {
            const dateObj = new Date(mapped.date);
            const fullIso = dateObj.toISOString();
            mapped.date = fullIso.split('T')[0];
            mapped.time = fullIso.split('T')[1].substring(0, 5);
        } catch (err) {
            console.warn("Failed to parse date from backend", mapped.date, err);
        }
    }

    return mapped;
};

export const api = {
    // Auth
    authTelegram: async (initData: string) => {
        const result = await fetchApi('/api/auth/telegram', {
            method: 'POST',
            body: JSON.stringify({ initData }),
        });

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
        return mapBackendToFrontend(data);
    },

    saveInvitation: async (invData: { id?: string | number; _id?: string; date?: string; time?: string;[key: string]: unknown }) => {
        const cleanData = { ...invData };

        // New invitation should have id: 0 as per schema
        if (!cleanData.id && !cleanData._id) {
            cleanData.id = 0;
        } else {
            cleanData.id = cleanData.id || cleanData._id;
        }
        delete cleanData._id;

        // Transform date/time to ISO Instant
        if (cleanData.date && typeof cleanData.date === 'string' && cleanData.time && typeof cleanData.time === 'string') {
            cleanData.date = `${cleanData.date}T${cleanData.time}:00.000Z`;
        } else if (cleanData.date && typeof cleanData.date === 'string') {
            cleanData.date = `${cleanData.date}T00:00:00.000Z`;
        }

        // Template mapping
        const currentTemplate = (cleanData.template || cleanData.templateId) as string;
        if (currentTemplate && templateMapping[currentTemplate]) {
            cleanData.template = templateMapping[currentTemplate];
        } else if (currentTemplate && !currentTemplate.startsWith('TEMPLATE_')) {
            cleanData.template = 'TEMPLATE_1';
        }

        // Cleanup
        delete cleanData.templateId;
        if (cleanData.message) {
            cleanData.text = cleanData.message;
            delete cleanData.message;
        }

        // Music mapping
        if (cleanData.backgroundMusic !== 'MUSIC_1' && cleanData.backgroundMusic !== 'MUSIC_2') {
            cleanData.backgroundMusic = 'MUSIC_1';
        }

        console.log(`DEBUG: Final saveInvitation payload:`, JSON.stringify(cleanData));

        return fetchApi('/api/invitations/init', {
            method: 'POST',
            body: JSON.stringify(cleanData),
        });
    },

    getMyInvitations: async () => {
        // Backend screenshot shows pageable is required.
        const response = await fetchApi('/api/invitations/self?page=0&size=50&sort=id,desc');
        console.log("DEBUG: Profile invitations response:", response);
        const list = Array.isArray(response) ? response : (response.content || []);
        return list.map(mapBackendToFrontend);
    },

    getCount: () => fetchApi('/api/invitations/self/count'),

    // User
    getUserByTelegramId: (telegramId: string) => fetchApi(`/api/users/by-telegram-id/${telegramId}`),

    healthCheck: () => fetchApi('/health-check'),
};
