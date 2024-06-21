import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(authContext);
    const isLoggedIn = !!token;

    if (isLoggedIn) {
        return children;
    } else {
        return <Navigate to="/login" replace={true} />;
    }
};

export default ProtectedRoute;
