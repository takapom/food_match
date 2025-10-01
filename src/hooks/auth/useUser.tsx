"use client";

import { useState } from "react";
import { useLocalStorage } from "../useLocalStorage";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  followingCount: number;
  followersCount: number;
  likesCount: number;
  hasBio: boolean;
  bio?: string;
  createdAt: string;
}

export const useUser = () => {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type ApiErrorResponse = {
    message?: string;
  };

  const fetchUserProfile = async (token: string): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const payload: User | ApiErrorResponse = await res.json();

      if (!res.ok) {
        const apiError = (payload as ApiErrorResponse).message ?? "Failed to fetch user profile";
        throw new Error(apiError);
      }

      const userData = payload as User;
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch user profile";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (token: string, updates: Partial<User>): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const payload: User | ApiErrorResponse = await res.json();

      if (!res.ok) {
        const apiError = (payload as ApiErrorResponse).message ?? "Failed to update user profile";
        throw new Error(apiError);
      }

      const updatedUser = payload as User;
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user profile";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-token");
  };

  return {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    logout,
    setUser,
  };
};

const a = 1;

//変更したよ！！