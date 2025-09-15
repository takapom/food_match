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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch user profile");
      }

      const userData: User = await res.json();
      setUser(userData);
      return userData;
    } catch (err: any) {
      setError(err.message);
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update user profile");
      }

      const updatedUser: User = await res.json();
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.message);
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
