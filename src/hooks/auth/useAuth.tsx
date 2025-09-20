import { useEffect, useState } from "react";

interface LoginResponse {
    token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'auth_token';
const TOKEN_EXPIRY_HOURS = Number(process.env.NEXT_PUBLIC_AUTH_TOKEN_HOURS || '12');
const COOKIE_MAX_AGE_MS = TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;



function getAuthTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}


function setAuthTokenCookie(token: string) {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + COOKIE_MAX_AGE_MS).toUTCString();
    // ローカル http 開発の場合 Secure を削りたいなら末尾から " Secure" を外す
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Expires=${expires}; SameSite=Lax; Secure`;
}


function clearAuthTokenCookie() {
    if (typeof document === 'undefined') return;
    document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;

    console.log("Cookie after clearing：", document.cookie)
}

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);


    useEffect(() => {
        const existing = getAuthTokenFromCookie();
        if (existing) setToken(existing);
    }, []);

    const login = async (email: string, password: string): Promise<LoginResponse | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                let message = 'Failed to login';
                try {
                    const errorData = await res.json();
                    if (errorData?.message) message = errorData.message;
                } catch {/* ignore */ }
                throw new Error(message);
            }

            const data: LoginResponse = await res.json();
            setAuthTokenCookie(data.token);
            setToken(data.token);
            return data;
        } catch (err: any) {
            setError(err?.message || 'Login error');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        clearAuthTokenCookie();
        setToken(null);
    };

    useEffect(() => {
        console.log("Updated token:", token);
    }, [token]);

    return {
        login,
        logout,
        loading,
        error,
        token,
        isAuthenticated: !!token,
        getAuthHeader: () => (token ? { Authorization: `Bearer ${token}` } : {}),
        tokenExpiresInHours: TOKEN_EXPIRY_HOURS,
    };
};