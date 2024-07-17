import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from "react-redux";
import { login } from "../AuthSlice";
import { BASE_URL } from "../../../config";


const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const token = Cookies.get('jwt'); 
    const user = useSelector((state) => state.auth.user); 
    const isLoggedIn = !!token; 

    useEffect(() => {
        const verifyToken = async () => {
            if (token && !user) {
                try {
                    const res = await fetch(`${BASE_URL}/auth/verifyToken`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });
                    const result = await res.json();
                    if (!res.ok) {
                        throw new Error(result.message);
                    }
                    dispatch(login({
                        user: result.data,
                        token: result.token,
                        apiKey: result.apiKey,
                    }));
                } catch (error) {
                    Cookies.remove('jwt');
                    console.error("Token verification failed:", error);
                }
            }
        };

        verifyToken();
    }, [dispatch, token, user]);

    return isLoggedIn ? children : <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;
