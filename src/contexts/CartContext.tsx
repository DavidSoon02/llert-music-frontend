import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { cartService } from '../services/api';
import type { CartItem, AddToCartRequest } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
    items: CartItem[];
    addToCart: (item: AddToCartRequest) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartItemsCount: () => number;
    loading: boolean;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const refreshCart = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const cartItems = await cartService.getCart();
            setItems(cartItems);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            refreshCart();
        } else {
            setItems([]);
        }
    }, [isAuthenticated]);

    const addToCart = async (item: AddToCartRequest) => {
        try {
            setLoading(true);
            await cartService.addToCart(item);
            await refreshCart();
        } catch (error) {
            console.error('Failed to add to cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            setLoading(true);
            await cartService.removeFromCart(productId);
            await refreshCart();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = () => {
        setItems([]);
    };

    const getCartTotal = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemsCount = () => {
        return items.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        items,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        loading,
        refreshCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
