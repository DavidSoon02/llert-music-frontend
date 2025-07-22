import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { first_name, last_name, email, password, confirmPassword } = formData;

        if (!first_name || !last_name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await register({ first_name, last_name, email, password });
            navigate('/');
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Registration failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-green-900 to-black flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-black/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-green-500/20">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-green-500 rounded-full mb-4">
                            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L13.2 8.6L20 7.4L14.8 12L20 16.6L13.2 15.4L12 22L10.8 15.4L4 16.6L9.2 12L4 7.4L10.8 8.6L12 2Z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Join Music Store</h1>
                        <p className="text-green-400">Create your account and start exploring</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-green-400 mb-2">
                                    First Name
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="First name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-green-400 mb-2">
                                    Last Name
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Last name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-green-400 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-green-400 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-green-400 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-black font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2"></div>
                                    Creating account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
