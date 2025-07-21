import React from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
    children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <Header />
            <main>
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default Layout;
