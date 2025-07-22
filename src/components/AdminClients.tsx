import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientsService } from '../services/api';
import type { Client } from '../types';
import { useNotifications } from '../contexts/NotificationContext';

const AdminClients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalClients, setTotalClients] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const { addNotification } = useNotifications();

    const limit = 10;

    // Form state
    const [newClient, setNewClient] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        fetchClients();
    }, [currentPage, searchTerm]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientsService.getAllClients(currentPage * limit, limit, searchTerm || undefined);
            setClients(response.users);
            setTotalClients(response.total);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            addNotification({ type: 'error', title: 'Error', message: 'Failed to load clients' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await clientsService.addClient(newClient);
            addNotification({ type: 'success', title: 'Success', message: 'Client added successfully' });
            setNewClient({ first_name: '', last_name: '', email: '', password: '' });
            setShowAddForm(false);
            fetchClients();
        } catch (err: any) {
            addNotification({ type: 'error', title: 'Error', message: err.message });
        }
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm('Are you sure you want to delete this client?')) return;

        try {
            setDeletingId(id);
            await clientsService.deleteClient(id);
            addNotification({ type: 'success', title: 'Success', message: 'Client deleted successfully' });
            fetchClients();
        } catch (err: any) {
            addNotification({ type: 'error', title: 'Error', message: err.message });
        } finally {
            setDeletingId(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchClients();
    };

    const totalPages = Math.ceil(totalClients / limit);

    if (loading && clients.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading clients...</p>
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
                        <Link to="/admin" className="text-blue-400 hover:text-blue-300 mb-2 inline-block">
                            ← Back to Admin Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold text-white mb-2">Clients Management</h1>
                        <p className="text-gray-400">Manage user accounts</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        {showAddForm ? 'Cancel' : 'Add New Client'}
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search clients by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Search
                        </button>
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setCurrentPage(0);
                                }}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Add Client Form */}
                {showAddForm && (
                    <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Add New Client</h2>
                        <form onSubmit={handleAddClient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={newClient.first_name}
                                    onChange={(e) => setNewClient({ ...newClient, first_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={newClient.last_name}
                                    onChange={(e) => setNewClient({ ...newClient, last_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={newClient.email}
                                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    value={newClient.password}
                                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Add Client
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
                            onClick={fetchClients}
                            className="mt-2 text-red-300 hover:text-red-200 underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Clients Table */}
                <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
                    <div className="p-6 border-b border-gray-700/50">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">
                                All Clients ({totalClients} total)
                            </h2>
                            {totalPages > 1 && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0}
                                        className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-gray-400">
                                        Page {currentPage + 1} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                        disabled={currentPage >= totalPages - 1}
                                        className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-800/30">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-blue-400 font-medium">
                                                        {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-white font-medium">
                                                        {client.first_name} {client.last_name}
                                                    </div>
                                                    <div className="text-gray-400 text-sm">{client.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{client.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                            {new Date(client.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeleteClient(client.id)}
                                                disabled={deletingId === client.id}
                                                className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === client.id ? (
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

                    {clients.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-400">No clients found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try adjusting your search.' : 'Get started by adding a new client.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminClients;
