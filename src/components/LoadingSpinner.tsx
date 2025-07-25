import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'green' | 'white' | 'gray';
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'green',
    text
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const colorClasses = {
        green: 'border-green-500 border-t-transparent',
        white: 'border-white border-t-transparent',
        gray: 'border-gray-400 border-t-transparent'
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`animate-spin rounded-full border-4 ${sizeClasses[size]} ${colorClasses[color]}`}
            />
            {text && (
                <p className={`mt-2 text-sm ${color === 'white' ? 'text-white' : 'text-gray-400'}`}>
                    {text}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
