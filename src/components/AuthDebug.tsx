import React from 'react';

const AuthDebug: React.FC = () => {

    // Solo mostrar en desarrollo
    if (import.meta.env.PROD) {
        return null;
    }

    return (
        <></>
    );
};

export default AuthDebug;
