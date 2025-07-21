import React, { useState, useEffect } from 'react';
import { songsService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from '../contexts/NotificationContext';
import type { Song } from '../types';

const SongCard: React.FC<{ song: Song; onAddToCart: (song: Song) => void; loading: boolean }> = ({
    song,
    onAddToCart,
    loading
}) => {
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-gray-900/50 rounded-xl p-4 hover:bg-gray-800/50 transition-all duration-300 group border border-gray-700/50">
            {/* Album Cover */}
            <div className="relative mb-4">
                <div className="aspect-square bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-lg flex items-center justify-center overflow-hidden">
                    {(song.cover || song.album_cover_big) ? (
                        <img
                            src={song.cover || song.album_cover_big}
                            alt={song.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Si la imagen falla al cargar, mostrar el ícono por defecto
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : (
                        <svg className="w-16 h-16 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                    )}
                </div>

                {/* Play Button Overlay */}
                <button className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors">
                        <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </button>
            </div>

            {/* Song Info */}
            <div className="mb-4">
                <h3 className="text-white font-semibold text-lg mb-1 truncate group-hover:text-green-400 transition-colors">
                    {song.title}
                </h3>
                <p className="text-gray-400 text-sm truncate">{song.artist || song.artist_name}</p>
                <p className="text-gray-500 text-xs mt-1">{formatDuration(song.duration)}</p>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
                <span className="text-green-400 font-bold text-lg">${song.price.toFixed(2)}</span>

                <button
                    onClick={() => onAddToCart(song)}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-black font-semibold px-4 py-2 rounded-lg transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13h10m-10 0l-1.5 6m3.5 0h8" />
                            </svg>
                            <span>Add</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const Songs: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'title' | 'artist' | 'price' | 'duration'>('title');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    const { addToCart } = useCart();
    const { addNotification } = useNotifications();

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            setLoading(true);
            const fetchedSongs = await songsService.getAllSongs();
            setSongs(fetchedSongs);
        } catch (error) {
            setError('Failed to load songs. Please try again.');
            console.error('Failed to fetch songs:', error);
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
            addNotification({
                type: 'success',
                title: 'Added to Cart',
                message: `${song.title} by ${song.artist || song.artist_name} has been added to your cart.`,
            });
        } catch (error) {
            console.error('Failed to add to cart:', error);
            addNotification({
                type: 'error',
                title: 'Failed to Add',
                message: 'Could not add the song to your cart. Please try again.',
            });
        } finally {
            setAddingToCart(null);
        }
    };

    const filteredAndSortedSongs = songs
        .filter(song =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (song.artist || song.artist_name || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let aValue = a[sortBy as keyof Song];
            let bValue = b[sortBy as keyof Song];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return (aValue || 0) > (bValue || 0) ? 1 : -1;
            } else {
                return (aValue || 0) < (bValue || 0) ? 1 : -1;
            }
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading your music...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={fetchSongs}
                            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Browse Music</h1>
                    <p className="text-gray-400">Discover and purchase your favorite tracks</p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search songs or artists..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Sort Options */}
                    <div className="flex space-x-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="title">Sort by Title</option>
                            <option value="artist">Sort by Artist</option>
                            <option value="price">Sort by Price</option>
                            <option value="duration">Sort by Duration</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
                        >
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                    </div>
                </div>

                {/* Songs Grid */}
                {filteredAndSortedSongs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedSongs.map(song => (
                            <SongCard
                                key={song._id}
                                song={song}
                                onAddToCart={handleAddToCart}
                                loading={addingToCart === song._id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎵</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No songs found</h3>
                        <p className="text-gray-400">
                            {searchTerm ? 'Try adjusting your search terms' : 'No songs available at the moment'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Songs;
