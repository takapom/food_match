"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export type AuthUser = {
    id: string;
    email?: string | null;
    role?: string | null;
};

export const useLogin = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const { data } = await supabase.auth.getSession();
            if (!mounted) return;
            const sessionUser = data?.session?.user ?? null;
            setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email } : null);
        })();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            const sUser = session?.user ?? null;
            setUser(sUser ? { id: sUser.id, email: sUser.email } : null);
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: e } = await supabase.auth.signInWithPassword({ email, password });
            if (e) {
                setError(e.message);
                return false;
            }
            const sUser = data.user ?? null;
            setUser(sUser ? { id: sUser.id, email: sUser.email } : null);
            return true;
        } finally {
            setLoading(false);
        }
    }, []);

    const signup = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: e } = await supabase.auth.signUp({ email, password });
            if (e) {
                setError(e.message);
                return false;
            }
            // サインアップは確認メール待ちのケースあり。セッションが返る場合はセットする
            const sUser = data.user ?? null;
            setUser(sUser ? { id: sUser.id, email: sUser.email } : null);
            return true;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { error: e } = await supabase.auth.signOut();
            if (e) setError(e.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
    };
};