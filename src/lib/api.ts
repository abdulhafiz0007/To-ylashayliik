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

    const status = response.status;
    const statusText = response.statusText;
    const text = await response.text().catch(() => '');

    if (!response.ok) {
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

const musicMapping: Record<string, string | null> = {
    'music1': 'MUSIC_1',
    'music2': 'MUSIC_2',
    'music3': 'MUSIC_2', // Backend only supports MUSIC_1, MUSIC_2. Mapping 3 to 2 for now.
    'none': null         // Try sending null for Musiqasiz
};

const reverseTemplateMapping: Record<string, string> = {
    'TEMPLATE_1': 'classic',
    'TEMPLATE_2': 'modern_slate'
};

const reverseMusicMapping: Record<string, string> = {
    'MUSIC_1': 'music1',
    'MUSIC_2': 'music2'
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

    saveInvitation: async (invData: any) => {
        // Strict mapping based on backend documentation screenshot
        const currentTemplate = invData.template || invData.templateId || 'classic';
        const templateEnum = templateMapping[currentTemplate] || (currentTemplate.startsWith('TEMPLATE_') ? currentTemplate : 'TEMPLATE_1');

        // Date transformation strictly to ISO Instant with milliseconds
        let dateISO = invData.date || "";
        if (invData.date && typeof invData.date === 'string' && invData.time && typeof invData.time === 'string') {
            dateISO = `${invData.date}T${invData.time}:00.000Z`;
        } else if (invData.date && typeof invData.date === 'string' && !invData.date.includes('T')) {
            dateISO = `${invData.date}T12:00:00.000Z`;
        }

        const payload: any = {
            id: Number(invData.id) || 0,
            groomName: invData.groomName || "",
            groomLastname: invData.groomLastname || "",
            groomPictureKey: invData.groomPictureKey || "",
            brideName: invData.brideName || "",
            brideLastname: invData.brideLastname || "",
            bridePictureKey: invData.bridePictureKey || "",
            date: dateISO,
            hall: invData.hall || "",
            text: invData.text || invData.message || "",
            location: invData.location || "",
            backgroundMusic: invData.backgroundMusic in musicMapping ? musicMapping[invData.backgroundMusic] : (invData.backgroundMusic || 'MUSIC_1'),
            template: templateEnum
        };

        // Explicit creator object if telegram user data or backend user info is provided
        if (invData.backendUserId || invData.creatorUser) {
            payload.creator = {
                id: Number(invData.backendUserId) || 0,
                telegramId: Number(invData.creatorUser?.id || 0),
                telegramUsername: invData.creatorUser?.username || "",
                firstname: invData.creatorUser?.first_name || "",
                lastname: invData.creatorUser?.last_name || "",
                photoUrl: invData.creatorUser?.photo_url || ""
            };
        }

        console.log(`DEBUG: Final saveInvitation payload:`, JSON.stringify(payload));

        return fetchApi('/api/invitations/init', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    uploadImage: async (file: File, putUrl: string) => {
        const response = await fetch(putUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to upload image: ${response.statusText}`);
        }

        return true;
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

    // Wishes (New API)
    getWishes: (invitationId: string | number) => fetchApi(`/api/wishes/by-invitation/${invitationId}`),
    postWish: (invitationId: number, wishText: string, name: string) => fetchApi('/api/wishes/post', {
        method: 'POST',
        body: JSON.stringify({
            name,
            wishText,
            invitation: { id: invitationId }
        })
    }),
};
