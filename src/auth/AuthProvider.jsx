/* eslint-disable react/prop-types */
import {useState, useEffect} from 'react';
import { AuthContext } from './AuthContext';

function AuthProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        localStorage.setItem('token', token);
    }, [token])

    function logout() {
        setToken(null);
    }

    function parseJwt(token) {
        if (!token) {
          return;
        }
        const base64Url = token.split(".")[1];
        return JSON.parse(window.atob(base64Url));
      }

    return (
        <AuthContext.Provider value={{token, setToken, logout, parseJwt}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;