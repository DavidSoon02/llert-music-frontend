import React, { useState } from 'react';

interface ServiceStatus {
    name: string;
    url: string;
    status: 'checking' | 'online' | 'offline' | 'error';
    message?: string;
    responseTime?: number;
}

const ServiceDebug: React.FC = () => {
    const [services, setServices] = useState<ServiceStatus[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    const serviceEndpoints = [
        { name: 'Login Service', url: import.meta.env.VITE_LOGIN_SERVICE_URL, endpoint: '/api/auth/health' },
        { name: 'Register Service', url: import.meta.env.VITE_REGISTER_SERVICE_URL, endpoint: '/health' },
        { name: 'Song List Service', url: import.meta.env.VITE_SONG_LIST_SERVICE_URL, endpoint: '/api/songs' },
        { name: 'Song Add Service', url: import.meta.env.VITE_SONG_ADD_SERVICE_URL, endpoint: '/health' },
        { name: 'Song Delete Service', url: import.meta.env.VITE_SONG_DELETE_SERVICE_URL, endpoint: '/health' },
        { name: 'Cart Add Service', url: import.meta.env.VITE_CART_ADD_SERVICE_URL, endpoint: '/health' },
        { name: 'Cart Remove Service', url: import.meta.env.VITE_CART_REMOVE_SERVICE_URL, endpoint: '/health' },
        { name: 'Cart View Service', url: import.meta.env.VITE_CART_VIEW_SERVICE_URL, endpoint: '/health' },
        { name: 'Client List Service', url: import.meta.env.VITE_CLIENT_LIST_SERVICE_URL, endpoint: '/health' },
        { name: 'Client Add Service', url: import.meta.env.VITE_CLIENT_ADD_SERVICE_URL, endpoint: '/health' },
        { name: 'Client Delete Service', url: import.meta.env.VITE_CLIENT_DELETE_SERVICE_URL, endpoint: '/health' },
    ];

    const checkService = async (service: { name: string; url: string; endpoint: string }): Promise<ServiceStatus> => {
        const startTime = Date.now();

        try {
            if (!service.url) {
                return {
                    name: service.name,
                    url: 'NOT_CONFIGURED',
                    status: 'error',
                    message: 'Environment variable not set'
                };
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${service.url}${service.endpoint}`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            clearTimeout(timeoutId);
            const responseTime = Date.now() - startTime;

            if (response.ok) {
                return {
                    name: service.name,
                    url: service.url,
                    status: 'online',
                    message: `HTTP ${response.status}`,
                    responseTime
                };
            } else {
                return {
                    name: service.name,
                    url: service.url,
                    status: 'error',
                    message: `HTTP ${response.status}`,
                    responseTime
                };
            }
        } catch (error: any) {
            const responseTime = Date.now() - startTime;

            if (error.name === 'AbortError') {
                return {
                    name: service.name,
                    url: service.url,
                    status: 'offline',
                    message: 'Timeout (10s)',
                    responseTime
                };
            }

            return {
                name: service.name,
                url: service.url,
                status: 'offline',
                message: error.message || 'Connection failed',
                responseTime
            };
        }
    };

    const checkAllServices = async () => {
        const initialServices = serviceEndpoints.map(service => ({
            name: service.name,
            url: service.url || 'NOT_CONFIGURED',
            status: 'checking' as const
        }));

        setServices(initialServices);

        const promises = serviceEndpoints.map(checkService);
        const results = await Promise.all(promises);

        setServices(results);
    };

    const getStatusColor = (status: ServiceStatus['status']) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'offline': return 'bg-red-500';
            case 'checking': return 'bg-yellow-500 animate-pulse';
            case 'error': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: ServiceStatus['status']) => {
        switch (status) {
            case 'online': return '✅';
            case 'offline': return '❌';
            case 'checking': return '⏳';
            case 'error': return '⚠️';
            default: return '❓';
        }
    };

    // Solo mostrar en desarrollo
    if (import.meta.env.PROD) {
        return null;
    }

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 transition-colors"
                title="Service Debug"
            >
                🔧
            </button>

            {/* Debug Panel */}
            {isVisible && (
                <div className="fixed bottom-16 left-4 bg-gray-900 text-white rounded-lg shadow-xl z-50 max-w-2xl w-full max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">Service Status</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={checkAllServices}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    Check All
                                </button>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        {services.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">Click "Check All" to test services</p>
                        ) : (
                            <div className="space-y-2">
                                {services.map((service, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`}></div>
                                            <div>
                                                <div className="font-medium">{service.name}</div>
                                                <div className="text-xs text-gray-400 truncate max-w-xs">
                                                    {service.url}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm">
                                            <div className="flex items-center gap-1">
                                                <span>{getStatusIcon(service.status)}</span>
                                                <span className="capitalize">{service.status}</span>
                                            </div>
                                            {service.message && (
                                                <div className="text-xs text-gray-400">{service.message}</div>
                                            )}
                                            {service.responseTime && (
                                                <div className="text-xs text-gray-400">{service.responseTime}ms</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Environment Variables */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <h4 className="font-semibold mb-2">Environment Variables</h4>
                            <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                                {Object.entries(import.meta.env)
                                    .filter(([key]) => key.startsWith('VITE_'))
                                    .map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-gray-400">{key}:</span>
                                            <span className="ml-2 truncate max-w-xs">{value as string || 'NOT_SET'}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ServiceDebug;
