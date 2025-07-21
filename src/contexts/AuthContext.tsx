import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/api';
import { decodeJWT, isTokenExpired } from '../utils/jwt';
import type { User } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: { first_name: string; last_name: string; email: string; password: string }) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    // Check if token is expired before making API call
                    if (isTokenExpired(storedToken)) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setLoading(false);
                        return;
                    }

                    const isValid = await authService.validateToken();
                    if (isValid) {
                        setToken(storedToken);
                        setUser(JSON.parse(storedUser));
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });

            if (response.success && response.data?.accessToken) {
                const userToken = response.data.accessToken;

                // Decode JWT to get user info using helper function
                const tokenPayload = decodeJWT(userToken);
                if (!tokenPayload) {
                    throw new Error('Invalid token received');
                }

                const userData: User = {
                    id: tokenPayload.userId,
                    first_name: tokenPayload.firstName,
                    last_name: tokenPayload.lastName,
                    email: tokenPayload.email
                };

                localStorage.setItem('token', userToken);
                localStorage.setItem('user', JSON.stringify(userData));

                setToken(userToken);
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData: { first_name: string; last_name: string; email: string; password: string }) => {
        try {
            const response = await authService.register(userData);

            if (response.success && response.data?.accessToken) {
                const userToken = response.data.accessToken;

                // Decode JWT to get user info using helper function
                const tokenPayload = decodeJWT(userToken);
                if (!tokenPayload) {
                    throw new Error('Invalid token received');
                }

                const userInfo: User = {
                    id: tokenPayload.userId,
                    first_name: tokenPayload.firstName,
                    last_name: tokenPayload.lastName,
                    email: tokenPayload.email
                };

                localStorage.setItem('token', userToken);
                localStorage.setItem('user', JSON.stringify(userInfo));

                setToken(userToken);
                setUser(userInfo);
                setIsAuthenticated(true);
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        authService.logout();
    };

    const value = {
        isAuthenticated,
        user,
        token,
        login,
        register,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
