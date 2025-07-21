import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { getCartItemsCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartItemsCount = getCartItemsCount();

    return (
        <header className="bg-black/95 backdrop-blur-lg border-b border-green-500/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="p-2 bg-green-500 rounded-lg">
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L13.2 8.6L20 7.4L14.8 12L20 16.6L13.2 15.4L12 22L10.8 15.4L4 16.6L9.2 12L4 7.4L10.8 8.6L12 2Z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">Llert Music</span>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    {isAuthenticated && (
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-green-400 transition-colors font-medium"
                            >
                                Discover
                            </Link>
                            <Link
                                to="/library"
                                className="text-gray-300 hover:text-green-400 transition-colors font-medium"
                            >
                                Your Library
                            </Link>
                            <Link
                                to="/songs"
                                className="text-gray-300 hover:text-green-400 transition-colors font-medium"
                            >
                                Browse Music
                            </Link>
                        </nav>
                    )}

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* Cart */}
                                <Link to="/cart" className="relative p-2 text-gray-300 hover:text-green-400 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13h10m-10 0l-1.5 6m3.5 0h8" />
                                    </svg>
                                    {cartItemsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-black font-semibold text-sm">
                                                {user?.first_name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="hidden md:block font-medium">{user?.first_name}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 py-2">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Settings
                                            </Link>
                                            <div className="border-t border-gray-700 my-2"></div>
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-lg transition-all transform hover:scale-105"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        {isAuthenticated && (
                            <button
                                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && isAuthenticated && (
                    <div className="md:hidden py-4 border-t border-gray-700">
                        <nav className="space-y-2">
                            <Link
                                to="/"
                                className="block py-2 text-gray-300 hover:text-green-400 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Discover
                            </Link>
                            <Link
                                to="/library"
                                className="block py-2 text-gray-300 hover:text-green-400 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Your Library
                            </Link>
                            <Link
                                to="/songs"
                                className="block py-2 text-gray-300 hover:text-green-400 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Browse Music
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
