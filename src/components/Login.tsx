import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await login(email, password);
            addNotification({
                type: 'success',
                title: 'Welcome back!',
                message: 'You have successfully logged in.',
            });
            navigate('/');
        } catch (error) {
            setError('Invalid email or password');
            addNotification({
                type: 'error',
                title: 'Login Failed',
                message: 'Please check your credentials and try again.',
            });
            console.error('Login failed:', error);
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
                        <h1 className="text-3xl font-bold text-white mb-2">Music Store</h1>
                        <p className="text-green-400">Welcome back to your music world</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-green-400 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-green-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Enter your password"
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
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Social Login Options */}
                <div className="mt-6 text-center">
                    <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-4 border border-green-500/20">
                        <p className="text-gray-400 text-sm mb-3">Or continue with</p>
                        <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
