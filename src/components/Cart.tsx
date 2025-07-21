import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
    const { items, removeFromCart, getCartTotal, getCartItemsCount, loading } = useCart();
    const [removingItem, setRemovingItem] = useState<string | null>(null);

    const handleRemoveItem = async (productId: string) => {
        try {
            setRemovingItem(productId);
            await removeFromCart(productId);
        } catch (error) {
            console.error('Failed to remove item:', error);
        } finally {
            setRemovingItem(null);
        }
    };

    const total = getCartTotal();
    const itemsCount = getCartItemsCount();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading your cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Your Cart</h1>
                    <p className="text-gray-400">
                        {itemsCount > 0 ? `${itemsCount} item${itemsCount > 1 ? 's' : ''} ready for checkout` : 'Your cart is empty'}
                    </p>
                </div>

                {items.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
                                <div className="p-6 border-b border-gray-700/50">
                                    <h2 className="text-xl font-semibold text-white">Items in your cart</h2>
                                </div>

                                <div className="divide-y divide-gray-700/50">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-6 flex items-center space-x-4">
                                            {/* Album Art Placeholder */}
                                            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                                </svg>
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium truncate">{item.productName}</h3>
                                                <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                                            </div>

                                            {/* Price */}
                                            <div className="text-green-400 font-semibold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item.productId)}
                                                disabled={removingItem === item.productId}
                                                className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Remove item"
                                            >
                                                {removingItem === item.productId ? (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-400 border-t-transparent"></div>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6 sticky top-24">
                                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Subtotal ({itemsCount} items)</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Tax</span>
                                        <span>$0.00</span>
                                    </div>
                                    <div className="border-t border-gray-700 pt-4">
                                        <div className="flex justify-between text-white font-semibold text-lg">
                                            <span>Total</span>
                                            <span className="text-green-400">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 mb-4">
                                    Proceed to Checkout
                                </button>

                                {/* PayPal Button Placeholder */}
                                <div className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-lg transition-all text-center cursor-pointer mb-4">
                                    🚧 PayPal Integration Coming Soon
                                </div>

                                <div className="text-center">
                                    <Link
                                        to="/songs"
                                        className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                                    >
                                        ← Continue Shopping
                                    </Link>
                                </div>

                                {/* Security Info */}
                                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center space-x-2 text-green-400 mb-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span className="text-sm font-medium">Secure Checkout</span>
                                    </div>
                                    <p className="text-gray-400 text-xs">
                                        Your payment information is processed securely. We do not store credit card details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart */
                    <div className="text-center py-16">
                        <div className="text-8xl mb-6">🛒</div>
                        <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Looks like you haven't added any songs to your cart yet.
                            Browse our collection and discover your next favorite track.
                        </p>
                        <Link
                            to="/songs"
                            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <span>Browse Music</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
