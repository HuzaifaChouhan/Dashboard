import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(() => {
        try {
            const token = localStorage.getItem('authToken');
            return token ? JSON.parse(token) : null;
        } catch (error) {
            console.error("Error parsing auth token:", error);
            localStorage.removeItem('authToken'); // Clear invalid token
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const loginUser = async (username, password) => {
        try {
            console.log('Logging in with:', username, password);
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Login successful:', response.data);
            setAuthToken(response.data);
            setUser({ username }); // In a real app, decode token to get user info
            localStorage.setItem('authToken', JSON.stringify(response.data));
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            // alert('Login failed!'); // Removed alert to avoid blocking UI
            return false;
        }
    };

    const logoutUser = () => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
    };

    const updateToken = async () => {
        // Implement refresh token logic here if needed
        // For simplicity, we just check if we have a token
        if (authToken) {
            // Verify token or refresh
            console.log('Token present, validation logic skipped for simplicity');
        }
        if (loading) setLoading(false);
    };

    useEffect(() => {
        if (loading) {
            updateToken();
        }

        let interval = setInterval(() => {
            if (authToken) {
                updateToken();
            }
        }, 1000 * 60 * 4); // 4 minutes

        return () => clearInterval(interval);
    }, [authToken, loading]);

    const contextData = {
        user,
        authToken,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
