import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { songsService } from '../services/api';
import type { Song } from '../types';
import { useNotifications } from '../contexts/NotificationContext';

const AdminSongs: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { addNotification } = useNotifications();

    // Form state
    const [newSong, setNewSong] = useState({
        title: '',
        artist: '',
        duration: 0,
        price: 0,
        cover: '',
        preview: ''
    });

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            setLoading(true);
            const response = await songsService.getAllSongs();
            setSongs(response);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            addNotification({ type: 'error', title: 'Error', message: 'Failed to load songs' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddSong = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await songsService.addSong(newSong);
            addNotification({ type: 'success', title: 'Success', message: 'Song added successfully' });
            setNewSong({ title: '', artist: '', duration: 0, price: 0, cover: '', preview: '' });
            setShowAddForm(false);
            fetchSongs();
        } catch (err: any) {
            addNotification({ type: 'error', title: 'Error', message: err.message });
        }
    };

    const handleDeleteSong = async (id: string) => {
        if (!confirm('Are you sure you want to delete this song?')) return;

        try {
            setDeletingId(id);
            await songsService.deleteSong(id);
            addNotification({ type: 'success', title: 'Success', message: 'Song deleted successfully' });
            fetchSongs();
        } catch (err: any) {
            addNotification({ type: 'error', title: 'Error', message: err.message });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading songs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link to="/admin" className="text-green-400 hover:text-green-300 mb-2 inline-block">
                            ← Back to Admin Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold text-white mb-2">Songs Management</h1>
                        <p className="text-gray-400">Manage your music catalog</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        {showAddForm ? 'Cancel' : 'Add New Song'}
                    </button>
                </div>

                {/* Add Song Form */}
                {showAddForm && (
                    <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Add New Song</h2>
                        <form onSubmit={handleAddSong} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newSong.title}
                                    onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Artist</label>
                                <input
                                    type="text"
                                    value={newSong.artist}
                                    onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Duration (seconds)</label>
                                <input
                                    type="number"
                                    value={newSong.duration}
                                    onChange={(e) => setNewSong({ ...newSong, duration: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newSong.price}
                                    onChange={(e) => setNewSong({ ...newSong, price: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Cover URL</label>
                                <input
                                    type="url"
                                    value={newSong.cover}
                                    onChange={(e) => setNewSong({ ...newSong, cover: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Preview URL</label>
                                <input
                                    type="url"
                                    value={newSong.preview}
                                    onChange={(e) => setNewSong({ ...newSong, preview: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Add Song
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 mb-6">
                        <p className="text-red-400">{error}</p>
                        <button
                            onClick={fetchSongs}
                            className="mt-2 text-red-300 hover:text-red-200 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Songs Table */}
                <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
                    <div className="p-6 border-b border-gray-700/50">
                        <h2 className="text-xl font-semibold text-white">All Songs ({songs.length})</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Song</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {songs.map((song) => (
                                    <tr key={song._id} className="hover:bg-gray-800/30">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    {song.cover ? (
                                                        <img src={song.cover} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                                                    ) : (
                                                        <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-white font-medium">{song.title}</div>
                                                    <div className="text-gray-400 text-sm">{song._id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{song.artist}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                            {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-400 font-medium">${song.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                            {new Date(song.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeleteSong(song._id)}
                                                disabled={deletingId === song._id}
                                                className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === song._id ? (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-400 border-t-transparent"></div>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {songs.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-400">No songs found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding a new song.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSongs;
