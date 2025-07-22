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
            console.log('🛒 CartContext: Starting refreshCart...');
            setLoading(true);
            const cartItems = await cartService.getCart();
            console.log('🛒 CartContext: Received cart items:', cartItems);
            setItems(cartItems);
            console.log('🛒 CartContext: Items state updated');
        } catch (error) {
            console.error('🛒 CartContext: Failed to fetch cart:', error);
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
            console.log('🛒 CartContext: Adding item to cart:', item);
            setLoading(true);
            await cartService.addToCart(item);
            console.log('🛒 CartContext: Item added successfully, refreshing cart...');
            await refreshCart();
        } catch (error) {
            console.error('🛒 CartContext: Failed to add to cart:', error);
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
        try {
            if (!Array.isArray(items)) {
                console.warn('Cart items is not an array:', items);
                return 0;
            }
            return items.reduce((total, item) => {
                if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
                    return total + (item.price * item.quantity);
                }
                return total;
            }, 0);
        } catch (error) {
            console.error('Error calculating cart total:', error);
            return 0;
        }
    };

    const getCartItemsCount = () => {
        try {
            if (!Array.isArray(items)) {
                console.warn('Cart items is not an array:', items);
                return 0;
            }
            return items.reduce((count, item) => {
                if (item && typeof item.quantity === 'number') {
                    return count + item.quantity;
                }
                return count;
            }, 0);
        } catch (error) {
            console.error('Error calculating cart items count:', error);
            return 0;
        }
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
