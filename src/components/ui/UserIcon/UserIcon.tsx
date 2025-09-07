"use client";

import Link from 'next/link';
import styles from './UserIcon.module.css';

interface UserIconProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function UserIcon({ size = 'medium', className }: UserIconProps) {
  return (
    <Link href="/user_page" className={`${styles.userIcon} ${styles[size]} ${className || ''}`}>
      <div className={styles.iconContainer}>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={styles.icon}
        >
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 20C7.6 20 4 16.4 4 12C4 10.9 4.9 10 6 10S8 10.9 8 12C8 14.2 9.8 16 12 16S16 14.2 16 12C16 10.9 17.1 10 18 10S20 10.9 20 12C20 16.4 16.4 20 12 20ZM12 8C14.2 8 16 9.8 16 12S14.2 16 12 16S8 14.2 8 12S9.8 8 12 8Z" />
        </svg>
      </div>
    </Link>
  );
}