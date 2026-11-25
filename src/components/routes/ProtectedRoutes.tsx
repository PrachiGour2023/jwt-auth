import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router';
import { useAuth } from '../../features/auth/context/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import { FullPageSpinner } from '.';

const ProtectedRoutes: React.FC = () => {
    const { isAuthenticated, isInitializing } = useAuth();
    const location = useLocation();

    // Wait for the session check; redirecting now would bounce a logged-in
    // user to /login on every page refresh.
    if (isInitializing) {
        return <FullPageSpinner label="Verifying secure session" />;
    }

    if (!isAuthenticated) {
        // Remember where they were headed so login can send them back.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <ErrorBoundary>
            <Outlet />
        </ErrorBoundary>
    );
};

export default ProtectedRoutes