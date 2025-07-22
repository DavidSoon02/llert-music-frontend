import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

const AdminDashboard: React.FC = () => {
    const { isAdmin } = useAdmin();

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
                    <p className="text-gray-400">You don't have permission to access this area</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage songs and clients</p>
                </div>

                {/* Admin Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Songs Management */}
                    <Link to="/admin/songs" className="group">
                        <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-8 hover:border-green-500/50 transition-all duration-300 group-hover:bg-gray-900/70">
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-2xl font-semibold text-white group-hover:text-green-400 transition-colors">
                                        Songs Management
                                    </h3>
                                    <p className="text-gray-400 mt-1">Add, edit, and delete songs</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-gray-300">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    View all songs
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Add new songs
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Delete songs
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Clients Management */}
                    <Link to="/admin/clients" className="group">
                        <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-8 hover:border-blue-500/50 transition-all duration-300 group-hover:bg-gray-900/70">
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                                        Clients Management
                                    </h3>
                                    <p className="text-gray-400 mt-1">Manage user accounts</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-gray-300">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    View all clients
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Add new clients
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Delete clients
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link to="/debug" className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6 hover:border-yellow-500/50 transition-all duration-300 hover:bg-gray-900/70">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-white">Service Debug</h3>
                                    <p className="text-gray-400 text-sm">Check microservices status</p>
                                </div>
                            </div>
                        </Link>

                        <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-white">System Status</h3>
                                    <p className="text-green-400 text-sm">All services operational</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-white">Admin Panel</h3>
                                    <p className="text-purple-400 text-sm">Full access mode</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
