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

    saveInvitation: (invData: { date?: string; time?: string;[key: string]: unknown }) => {
        // Ensure we don't send empty ID which might confuse backend
        const cleanData = { ...invData };
        delete cleanData.id;
        delete cleanData._id;

        // Transform separate date and time into ISO date (Instant)
        if (cleanData.date && typeof cleanData.date === 'string' && cleanData.time && typeof cleanData.time === 'string') {
            // Combine into ISO format: YYYY-MM-DDTHH:mm:00Z
            // We assume the date/time input is local, but Instant requires a timezone.
            // Appending 'Z' for UTC is the simplest way to satisfy Instant deserializer.
            cleanData.date = `${cleanData.date}T${cleanData.time}:00Z`;
        } else if (cleanData.date && typeof cleanData.date === 'string') {
            cleanData.date = `${cleanData.date}T00:00:00Z`;
        }

        // Ensure template and text are sent correctly as per backend schema
        if (cleanData.templateId) {
            cleanData.template = cleanData.templateId;
            delete cleanData.templateId;
        }
        if (cleanData.message) {
            cleanData.text = cleanData.message;
            delete cleanData.message;
        }

        // Mapping for template and music to match backend enum-like strings if necessary
        // (Assuming backend might be strict about TEMPLATE_1 format, but keeping flexibility)
        if (cleanData.template === 'classic' || cleanData.template === 'modern') {
            // Optional: convert to uppercase if backend expects TEMPLATE_1 types
            // cleanData.template = `TEMPLATE_${cleanData.template.toUpperCase()}`;
        }

        return fetchApi('/api/invitations/init', {
            method: 'POST',
            body: JSON.stringify(cleanData),
        });
    },

    getMyInvitations: async () => {
        const response = await fetchApi('/api/invitations/self');
        // Handle paginated response structure { content: [], totalElements: ... }
        return Array.isArray(response) ? response : (response.content || []);
    },

    getCount: () => fetchApi('/api/invitations/self/count'),

    // User
    getUserByTelegramId: (telegramId: string) => fetchApi(`/api/users/by-telegram-id/${telegramId}`),

    healthCheck: () => fetchApi('/health-check'),
};
