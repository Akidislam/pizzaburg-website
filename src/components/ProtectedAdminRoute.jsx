import { Navigate } from 'react-router-dom';

/**
 * Wraps a route so it's only accessible when the admin is logged in.
 * Login state is persisted in localStorage under the key "admin_logged_in".
 */
const ProtectedAdminRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    return isLoggedIn ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedAdminRoute;
