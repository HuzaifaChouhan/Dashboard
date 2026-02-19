import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

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
    const [loading, setLoading] = useState(false);

    const loginUser = async (username, password) => {
        try {
            console.log('Logging in with:', username, password);
            const response = await axios.post(`${API_URL}/api/token/`, {
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
        // In a real app with refresh tokens, we would hit the refresh endpoint here.
        // For this simple JWT implementation, we will just check if the token is expired via decoding (simplified)
        // or rely on the backend 401 to log us out.

        // Simple check: if access token exists but we get 401, we should logout.
        // We can add an axios interceptor for this, or just handle it in the components.
    };

    useEffect(() => {
        // Add a global axios interceptor to handle 401s
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    console.warn("Token expired or unauthorized. Logging out.");
                    logoutUser();
                    // Optional: redirect to login if not already there
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

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
