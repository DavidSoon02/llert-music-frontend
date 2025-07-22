import axios from 'axios';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    Song,
    CartItem,
    AddToCartRequest,
    Client,
    ClientListResponse
} from '../types';

// API Base Configuration
const api = axios.create({
    timeout: 30000, // Aumentado a 30 segundos
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Agregar logs para debug
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
}, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('API Error:', error);

        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - service may be down');
        }

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth Service
export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post(`${import.meta.env.VITE_LOGIN_SERVICE_URL}/api/auth/login`, credentials);
        return response.data;
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post(`${import.meta.env.VITE_REGISTER_SERVICE_URL}/register`, userData);
        return response.data;
    },

    async validateToken(): Promise<boolean> {
        try {
            // First check if token exists
            const token = localStorage.getItem('token');
            if (!token) return false;

            const response = await api.post(`${import.meta.env.VITE_LOGIN_SERVICE_URL}/api/auth/validate`);
            return response.data.success;
        } catch {
            return false;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};

// Songs Service
export const songsService = {
    async getAllSongs(): Promise<Song[]> {
        try {
            console.log('Fetching songs from:', import.meta.env.VITE_SONG_LIST_SERVICE_URL);
            const response = await api.get(`${import.meta.env.VITE_SONG_LIST_SERVICE_URL}/api/songs`);
            const songs = response.data.songs || response.data || [];

            // Normalizar cada canción para que tenga propiedades consistentes
            return songs.map((song: any) => ({
                ...song,
                // Propiedades de compatibilidad
                artist: song.artist_name || song.artist || 'Unknown Artist',
                cover: song.album_cover_big || song.cover,
            }));
        } catch (error: any) {
            console.error('Error fetching songs:', error);

            if (error.code === 'ECONNABORTED') {
                throw new Error('Connection timeout - Song service may be unavailable. Please try again later.');
            }

            if (error.response?.status === 404) {
                throw new Error('Songs service not found. Please contact support.');
            }

            if (error.response?.status >= 500) {
                throw new Error('Song service is experiencing issues. Please try again later.');
            }

            throw new Error(`Failed to fetch songs: ${error.message}`);
        }
    },

    async getSongById(id: string): Promise<Song> {
        try {
            const response = await api.get(`${import.meta.env.VITE_SONG_LIST_SERVICE_URL}/api/songs/${id}`);
            const song = response.data;

            return {
                ...song,
                artist: song.artist_name || song.artist || 'Unknown Artist',
                cover: song.album_cover_big || song.cover,
            };
        } catch (error: any) {
            console.error('Error fetching song:', error);
            throw new Error(`Failed to fetch song: ${error.message}`);
        }
    },

    async addSong(songData: Omit<Song, '_id' | 'createdAt'>): Promise<Song> {
        const response = await api.post(`${import.meta.env.VITE_SONG_ADD_SERVICE_URL}/api/songs`, songData);
        return response.data;
    },

    async deleteSong(id: string): Promise<void> {
        await api.delete(`${import.meta.env.VITE_SONG_DELETE_SERVICE_URL}/api/songs/${id}`);
    }
};

// Cart Service
export const cartService = {
    async addToCart(item: AddToCartRequest): Promise<CartItem> {
        const response = await api.post(`${import.meta.env.VITE_CART_ADD_SERVICE_URL}/api/cart/add`, item);
        return response.data.item;
    },

    async removeFromCart(productId: string): Promise<void> {
        await api.delete(`${import.meta.env.VITE_CART_REMOVE_SERVICE_URL}/api/cart/remove`, {
            data: { productId }
        });
    },

    async getCart(): Promise<CartItem[]> {
        console.log('🛒 Fetching cart items...');
        const response = await api.get(`${import.meta.env.VITE_CART_VIEW_SERVICE_URL}/api/cart`);
        console.log('🛒 Cart response:', response.data);

        // El backend devuelve { success, message, data: { items, total, itemCount } }
        if (response.data.success && response.data.data) {
            const items = response.data.data.items || [];
            console.log('🛒 Extracted cart items:', items);
            return items;
        }

        // Fallback para otras estructuras
        return response.data.cart || response.data.items || response.data || [];
    }
};

// Clients Service (Admin)
export const clientsService = {
    async getAllClients(skip = 0, limit = 10, search?: string): Promise<ClientListResponse> {
        const params = new URLSearchParams({
            skip: skip.toString(),
            limit: limit.toString()
        });
        if (search) params.append('search', search);

        const response = await api.get(`${import.meta.env.VITE_CLIENT_LIST_SERVICE_URL}/users?${params}`);
        return response.data;
    },

    async getClientById(id: string): Promise<Client> {
        const response = await api.get(`${import.meta.env.VITE_CLIENT_LIST_SERVICE_URL}/users/${id}`);
        return response.data;
    },

    async addClient(clientData: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
        const response = await api.post(`${import.meta.env.VITE_CLIENT_ADD_SERVICE_URL}/users`, clientData);
        return response.data;
    },

    async deleteClient(id: string): Promise<void> {
        await api.delete(`${import.meta.env.VITE_CLIENT_DELETE_SERVICE_URL}/users/${id}`);
    }
};
