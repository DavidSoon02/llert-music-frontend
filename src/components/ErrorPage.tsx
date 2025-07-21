import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorPageProps {
    code?: string;
    title?: string;
    message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    code = '404',
    title = 'Page Not Found',
    message = 'The page you are looking for does not exist.'
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-green-500 mb-4">{code}</h1>
                    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">{message}</p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Go Home</span>
                    </Link>

                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/songs"
                            className="text-green-400 hover:text-green-300 font-medium transition-colors"
                        >
                            Browse Music
                        </Link>
                        <span className="text-gray-600">•</span>
                        <Link
                            to="/cart"
                            className="text-green-400 hover:text-green-300 font-medium transition-colors"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="mt-12 opacity-20">
                    <svg className="w-32 h-32 mx-auto text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
