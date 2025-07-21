// Authentication Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        accessToken: string;
        expiresIn: string;
        tokenType: string;
    };
}export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at?: string;
}

// Song Types
export interface Song {
    _id: string;
    title: string;
    artist_name: string;  // Actualizado para coincidir con el backend
    album_title: string;  // Agregado según la respuesta del backend
    duration: number;
    album_cover_big?: string;
    preview?: string;
    price: number;
    createdAt: string;
    // Propiedades de compatibilidad
    artist?: string;  // Para compatibilidad con componentes existentes
    cover?: string;   // Alias para album_cover_big
}

export interface SongListResponse {
    songs: Song[];
    total?: number;
}

// Cart Types
export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    userId: string;
}

export interface AddToCartRequest {
    productId: string;
    quantity: number;
    productName: string;
    price: number;
}

// Client Types
export interface Client {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

export interface ClientListResponse {
    users: Client[];
    total: number;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// UI State Types
export interface AppState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    cart: CartItem[];
    loading: boolean;
    error: string | null;
}
