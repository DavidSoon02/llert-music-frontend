import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { songsService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import type { Song } from '../types';

const FeaturedSongCard: React.FC<{ song: Song; onAddToCart: (song: Song) => void; loading: boolean }> = ({
    song,
    onAddToCart,
    loading
}) => {
    // Validar que song y song.price existan, proporcionar valores por defecto
    const price = song?.price ?? 0;
    const title = song?.title ?? 'Unknown Title';
    const artist = (song?.artist || song?.artist_name) ?? 'Unknown Artist';
    const cover = song?.cover || song?.album_cover_big;

    return (
        <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {cover ? (
                        <img
                            src={cover}
                            alt={title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                // Si la imagen falla al cargar, mostrar el ícono por defecto
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
                    <p className="text-gray-400 truncate">{artist}</p>
                    <p className="text-green-400 font-bold">
                        ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
                    </p>
                </div>

                <button
                    onClick={() => onAddToCart(song)}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-black font-semibold px-4 py-2 rounded-lg transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                    ) : (
                        'Add to Cart'
                    )}
                </button>
            </div>
        </div>
    );
};

const Home: React.FC = () => {
    const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        fetchFeaturedSongs();
    }, []);

    const fetchFeaturedSongs = async () => {
        try {
            setLoading(true);
            const songs = await songsService.getAllSongs();
            // Get first 6 songs as featured
            setFeaturedSongs(songs.slice(0, 6));
        } catch (error) {
            console.error('Failed to fetch featured songs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (song: Song) => {
        try {
            setAddingToCart(song._id);
            await addToCart({
                productId: song._id,
                productName: `${song.title} - ${song.artist || song.artist_name}`,
                price: song.price,
                quantity: 1
            });
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-purple-500/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Welcome to <span className="text-green-400">Llert Music</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Discover, purchase, and enjoy millions of songs from your favorite artists.
                            Build your perfect music collection today.
                        </p>
                        {user && (
                            <p className="text-green-400 text-lg mb-8">
                                Hello, {user.first_name}! Ready to discover new music?
                            </p>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/songs"
                                className="inline-flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-black font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                                <span>Browse Music</span>
                            </Link>
                            <Link
                                to="/cart"
                                className="inline-flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all border border-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13h10m-10 0l-1.5 6m3.5 0h8" />
                                </svg>
                                <span>View Cart</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Songs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Featured Tracks</h2>
                    <p className="text-gray-400">Discover the latest and greatest music</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-700 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
                                        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                                    </div>
                                    <div className="w-24 h-10 bg-gray-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredSongs.map((song) => (
                            <FeaturedSongCard
                                key={song._id}
                                song={song}
                                onAddToCart={handleAddToCart}
                                loading={addingToCart === song._id}
                            />
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link
                        to="/songs"
                        className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 font-medium transition-colors"
                    >
                        <span>View All Songs</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-900/50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Why Choose Llert Music?</h2>
                        <p className="text-gray-400">The best music experience, tailored for you</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">High Quality Audio</h3>
                            <p className="text-gray-400">Crystal clear sound quality for the ultimate listening experience</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Secure Payments</h3>
                            <p className="text-gray-400">Safe and secure transactions with industry-leading encryption</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Instant Access</h3>
                            <p className="text-gray-400">Download and enjoy your music immediately after purchase</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Musical Journey?</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Join thousands of music lovers who trust Llert Music for their audio needs
                    </p>
                    <Link
                        to="/songs"
                        className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-black font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
                    >
                        <span>Start Exploring</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
