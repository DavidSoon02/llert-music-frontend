import { useAuth } from '../contexts/AuthContext';

export const useAdmin = () => {
    const { user, isAuthenticated } = useAuth();

    const isAdmin = isAuthenticated && user?.email === 'admin@gmail.com';

    return {
        isAdmin,
        canAccessAdmin: isAdmin
    };
};
