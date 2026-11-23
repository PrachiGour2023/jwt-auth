import React from 'react'
import { useAuth } from '../../features/auth/context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router';
import ErrorBoundary from './ErrorBoundary';
import { FullPageSpinner } from '.';


const PublicRoutes: React.FC = () => {
    const { isAuthenticated, isInitializing } = useAuth();
    const location = useLocation();

    if (isInitializing) {
        return <FullPageSpinner />;
    }

    if (isAuthenticated) {
        // After login, return to the page they originally wanted.
        const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
        return <Navigate to={from ?? '/dashboard'} replace />;
    }

    return (
        <ErrorBoundary>
            <Outlet />
        </ErrorBoundary>
    );
};

export default PublicRoutes