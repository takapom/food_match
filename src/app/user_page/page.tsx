"use client";

import styles from './page.module.css';
import HeaderNavigation from '../../components/profile/HeaderNavigation/HeaderNavigation';
import ProfileSection from '../../components/profile/ProfileSection/ProfileSection';
import CreateVideoCard from '../../components/profile/CreateVideoCard/CreateVideoCard';
import BottomNavigation from '../../components/profile/BottomNavigation/BottomNavigation';
import { mockRootProps } from './userProfileMockData';

export default function UserProfilePage() {
    const { user, currentTab } = mockRootProps;

    return (
        <div className={styles.container}>
            <HeaderNavigation displayName={user.displayName} />
            <ProfileSection user={user} />
            <CreateVideoCard />
            <BottomNavigation currentTab={currentTab} />
        </div>
    );
}