"use client";

import styles from "./page.module.css";
import BottomNavigation from "@/components/profile/BottomNavigation/BottomNavigation";
import CreateVideoCard from "@/components/profile/CreateVideoCard/CreateVideoCard";
import HeaderNavigation from "@/components/profile/HeaderNavigation/HeaderNavigation";
import ProfileSection from "@/components/profile/ProfileSection/ProfileSection";
import { mockRootProps } from "./userProfileMockData";
import { useLogin } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";

type InfoRow = {
    label: string;
    value: string;
};

const highlightChips = ["プレミアム会員", "レビュー 48件", "お気に入り 120件"];

const dummyProfileUser = {
    ...mockRootProps.user,
    username: "guest_user",
    displayName: "ゲストユーザー",
    followingCount: 12,
    followersCount: 34,
    likesCount: 56
};

const dummyInfoRows: InfoRow[] = [
    { label: "ユーザー名", value: `@${dummyProfileUser.username}` },
    { label: "メール", value: "guest@example.com" },
    { label: "登録日", value: "2024/01/01" }
];

export default function UserProfilePage() {
    const headerName = dummyProfileUser.displayName;
    const { logout } = useLogin();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login")
    };

    return (
        <div className={styles.appShell}>
            <div className={styles.backgroundGlowPrimary} />
            <div className={styles.backgroundGlowSecondary} />

            <HeaderNavigation displayName={headerName} />

            <main className={styles.mainContent}>
                <section className={styles.heroSection}>
                    <h1 className={styles.heroTitle}>プロフィール</h1>
                    <div className={styles.heroChips}>
                        {highlightChips.map((chip) => (
                            <span key={chip} className={styles.heroChip}>
                                {chip}
                            </span>
                        ))}
                    </div>
                </section>

                <section className={styles.profilePanel}>
                    <div className={styles.profileHeader}>
                        <ProfileSection user={dummyProfileUser} />
                    </div>

                    <div className={styles.quickStats}>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>フォロー中</span>
                            <strong className={styles.statValue}>{dummyProfileUser.followingCount}</strong>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>フォロワー</span>
                            <strong className={styles.statValue}>{dummyProfileUser.followersCount}</strong>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>いいね</span>
                            <strong className={styles.statValue}>{dummyProfileUser.likesCount}</strong>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoCardHeader}>
                            <span className={styles.infoBadge}>ACCOUNT</span>
                            <h2 className={styles.infoTitle}>アカウント情報</h2>
                            <p className={styles.infoSubtitle}>プロフィールの基本情報を確認できます。</p>
                        </div>

                        <div className={styles.infoList}>
                            {dummyInfoRows.map((row) => (
                                <div key={row.label} className={styles.infoRow}>
                                    <span className={styles.infoLabel}>{row.label}</span>
                                    <span className={styles.infoValue}>{row.value}</span>
                                </div>
                            ))}

                            <div className={styles.infoActions}>
                                <button
                                    className={styles.richLogoutButton}
                                    onClick={handleLogout}
                                >
                                    <span className={styles.logoutIcon}>🚪</span>
                                    <span className={styles.logoutText}>ログアウト</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <CreateVideoCard />
            <BottomNavigation currentTab="profile" />
        </div>
    );
}
