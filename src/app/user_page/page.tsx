"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import HeaderNavigation from "@/components/profile/HeaderNavigation/HeaderNavigation";
import ProfileSection from "@/components/profile/ProfileSection/ProfileSection";
import BottomNavigation from "@/components/profile/BottomNavigation/BottomNavigation";
import CreateVideoCard from "@/components/profile/CreateVideoCard/CreateVideoCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner/LoadingSpinner";
import Button from "@/components/ui/Button/Button";
import { formatDate } from "@/utils";
import { useUser } from "@/hooks/auth/useUser";
import { mockRootProps } from "./userProfileMockData";
import Link from "next/link";

const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "auth_token";

//後々これを再利用できるようにする
function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

export default function UserProfilePage() {
    const { user, loading, fetchUserProfile, logout } = useUser();
    const [mounted, setMounted] = useState(false);

    // Ensure first client render matches server HTML to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch actual profile only after mount
    useEffect(() => {
        if (!mounted) return;
        if (user) return
        const token = getCookie(AUTH_COOKIE_NAME);
        if (token) fetchUserProfile(token);
    }, [mounted, user, fetchUserProfile]);

    const safeUser = mounted && user ? user : null;

    const headerName = safeUser?.displayName || mockRootProps.user.displayName;

    const profileUser = safeUser
        ? {
            username: safeUser.username || mockRootProps.user.username,
            displayName: safeUser.displayName || mockRootProps.user.displayName,
            avatar: safeUser.avatar || "/images/profile-avatar.png",
            followingCount: safeUser.followingCount ?? mockRootProps.user.followingCount,
            followersCount: safeUser.followersCount ?? mockRootProps.user.followersCount,
            likesCount: safeUser.likesCount ?? mockRootProps.user.likesCount,
            hasBio: safeUser.hasBio ?? mockRootProps.user.hasBio,
        }
        : mockRootProps.user;

    return (
        <div className={styles.page}>
            <HeaderNavigation displayName={headerName} />

            <main className={styles.main}>
                {loading && mounted ? (
                    <div className={styles.section}>
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <ProfileSection user={profileUser} />

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>基本情報</h2>
                            {safeUser ? (
                                <div className={styles.infoList}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>ユーザー名</span>
                                        <span className={styles.infoValue}>@{profileUser.username}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>メール</span>
                                        <span className={styles.infoValue}>{safeUser.email}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>登録日</span>
                                        <span className={styles.infoValue}>{formatDate(safeUser.createdAt)}</span>
                                    </div>

                                    <div className={styles.actions}>
                                        <Button variant="ghost" onClick={logout}>ログアウト</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    ログインするとプロフィールが表示されます。
                                    <div className={styles.actions}>
                                        <Link href="/login">
                                            <Button>ログインへ</Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            <CreateVideoCard />
            <BottomNavigation currentTab="profile" />
        </div>
    );
}
