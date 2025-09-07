"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProfileSection.module.css';
import ProfileStats from '../ProfileStats/ProfileStats';
import Button from '../../ui/Button/Button';
import BookmarkIcon from '../../icons/BookmarkIcon';

interface User {
  username: string;
  displayName: string;
  avatar: string;
  followingCount: number;
  followersCount: number;
  likesCount: number;
  hasBio: boolean;
}

interface ProfileSectionProps {
  user: User;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className={styles.profileSection}>
      <div className={styles.avatarContainer}>
        <Image
          src={user.avatar}
          alt={`${user.displayName} profile`}
          width={96}
          height={96}
          className={styles.avatar}
        />
      </div>

      <div className={styles.username}>@{user.username}</div>

      <ProfileStats
        followingCount={user.followingCount}
        followersCount={user.followersCount}
        likesCount={user.likesCount}
      />

      <div className={styles.actionButtons}>
        <Button variant="secondary" className={styles.editButton}>
          Edit profile
        </Button>
        <button 
          className={styles.bookmarkButton}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <BookmarkIcon width={20} height={20} color={isBookmarked ? "#161722" : "#86878b"} />
        </button>
      </div>

      <div className={styles.bioPlaceholder}>
        Tap to add bio
      </div>
    </div>
  );
}