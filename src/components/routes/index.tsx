import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import PublicRoutes from "./PublicRoutes";
import SignupForm from "../../features/auth/pages/SignupForm";
import LoginForm from "../../features/auth/pages/LoginForm";
import ProtectedRoutes from "./ProtectedRoutes";
import OverviewTab from "../../features/dashboard/pages/OverviewTab";
import { Navigate } from "react-router";
import EmailVerification from "../../features/auth/pages/EmailVerification";
import CreatePost from "../../features/post/pages/CreatePost";
import UpdateProfile from "../../features/dashboard/pages/UpdateProfile";
import BookmarkPost from "../../features/post/pages/BookmarkPost";

export const FullPageSpinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
    <div
        className="flex min-h-screen items-center justify-center gap-3"
        role="status"
        aria-live="polite"
    >
        {/* the spinner is its own element, so the text doesn't rotate */}
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <span>{label}</span>
    </div>
);

const router = createBrowserRouter([
    {
        element: <PublicRoutes />,
        children: [
            { path: '/', element: <Navigate to="/signup" replace /> },
            {path: '/signup', element: <SignupForm />},
            {path: '/login', element: <LoginForm />},
            {path: '/email-verify', element: <EmailVerification />}
        ]
    },
    {
        element: <ProtectedRoutes />,
        children: [
            {path: 'dashboard', element: <OverviewTab />},
            {path: 'create-post', element: <CreatePost />},
            {path: 'update-user-profile', element: <UpdateProfile />},
            {path: 'bookmarks', element: <BookmarkPost />}
        ]
    },
    { path: '*', element: <Navigate to="/" replace /> },
])

export const AppRoutes = () => <RouterProvider router={router} /> 