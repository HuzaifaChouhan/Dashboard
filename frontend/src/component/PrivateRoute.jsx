import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, authToken } = useContext(AuthContext);

    // Simple check: if no token, redirect to login
    // In a real app, you might want to wait for 'loading' state
    // But since initial state of authToken comes from localStorage, it's synchronous-ish
    // except for the validation part.

    // For now, if we have a token, we assume logged in.
    return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
