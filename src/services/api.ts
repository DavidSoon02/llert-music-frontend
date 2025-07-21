import axios, { type AxiosResponse } from 'axios';
import type {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    Song,
    CartItem,
    AddToCartRequest,
    Client,
    ClientListResponse
} from '../types';

// Create axios instance with interceptors
const api = axios.create({
    timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
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

// Función para normalizar datos de canciones y agregar propiedades de compatibilidad
const normalizeSong = (song: any): Song => {
    return {
        ...song,
        // Propiedades de compatibilidad
        artist: song.artist_name || song.artist || 'Unknown Artist',
        cover: song.album_cover_big || song.cover,
    };
};

// Songs Service
export const songsService = {
    async getAllSongs(): Promise<Song[]> {
        try {
            const response = await api.get(`${import.meta.env.VITE_SONG_LIST_SERVICE_URL}/api/songs`);
            const songs = response.data.songs || response.data || [];

            // Normalizar cada canción para que tenga propiedades consistentes
            return songs.map(normalizeSong);
        } catch (error) {
            console.error('Error fetching songs:', error);
            return [];
        }
    },

    async getSongById(id: string): Promise<Song> {
        const response = await api.get(`${import.meta.env.VITE_SONG_LIST_SERVICE_URL}/api/songs/${id}`);
        return normalizeSong(response.data);
    },

    async addSong(songData: Omit<Song, '_id' | 'createdAt'>): Promise<Song> {
        const response = await api.post(`${import.meta.env.VITE_SONG_ADD_SERVICE_URL}/api/songs`, songData);
        return normalizeSong(response.data);
    },

    async deleteSong(id: string): Promise<void> {
        await api.delete(`${import.meta.env.VITE_SONG_DELETE_SERVICE_URL}/api/songs/${id}`);
    }
};

// Cart Service
export const cartService = {
    async addToCart(item: AddToCartRequest): Promise<CartItem> {
        const response = await api.post(`${import.meta.env.VITE_CART_ADD_SERVICE_URL}/api/cart/add`, item);

        // Manejar diferentes estructuras de respuesta
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        return response.data.item || response.data;
    },

    async removeFromCart(productId: string, quantity?: number): Promise<void> {
        await api.delete(`${import.meta.env.VITE_CART_REMOVE_SERVICE_URL}/api/cart/remove`, {
            data: { productId, quantity: quantity || 1 }
        });
    },

    async getCart(): Promise<CartItem[]> {
        try {
            const response = await api.get(`${import.meta.env.VITE_CART_VIEW_SERVICE_URL}/api/cart`);

            // Manejar diferentes estructuras de respuesta del backend
            if (response.data.success && response.data.data) {
                // Si la respuesta tiene success: true y data
                const cartData = response.data.data;
                if (Array.isArray(cartData.items)) {
                    return cartData.items;
                }
                if (Array.isArray(cartData)) {
                    return cartData;
                }
            }

            // Si la respuesta tiene cart directamente
            if (response.data.cart && Array.isArray(response.data.cart.items)) {
                return response.data.cart.items;
            }

            // Si la respuesta es directamente un array
            if (Array.isArray(response.data)) {
                return response.data;
            }

            // Si no encuentra items, devolver array vacío
            console.warn('Unexpected cart response structure:', response.data);
            return [];

        } catch (error) {
            console.error('Error fetching cart:', error);
            return [];
        }
    },

    async clearCart(): Promise<void> {
        await api.delete(`${import.meta.env.VITE_CART_REMOVE_SERVICE_URL}/api/cart/clear`);
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
