import type { User } from '../types';

export interface JWTPayload {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    iat: number;
    exp: number;
}

export const decodeJWT = (token: string): JWTPayload | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const payload = parts[1];
        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodedPayload) as JWTPayload;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const extractUserFromToken = (token: string): User | null => {
    const payload = decodeJWT(token);
    if (!payload) {
        return null;
    }

    return {
        id: payload.userId,
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
    };
};

export const isTokenExpired = (token: string): boolean => {
    const payload = decodeJWT(token);
    if (!payload) {
        return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};