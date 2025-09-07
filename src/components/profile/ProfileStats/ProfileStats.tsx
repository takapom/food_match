import styles from './ProfileStats.module.css';

interface ProfileStatsProps {
  followingCount: number;
  followersCount: number;
  likesCount: number;
}

export default function ProfileStats({ followingCount, followersCount, likesCount }: ProfileStatsProps) {
  return (
    <div className={styles.stats}>
      <div className={styles.statItem}>
        <div className={styles.statNumber}>{followingCount}</div>
        <div className={styles.statLabel}>Following</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statNumber}>{followersCount}</div>
        <div className={styles.statLabel}>Followers</div>
      </div>
      <div className={styles.statItem}>
        <div className={styles.statNumber}>{likesCount}</div>
        <div className={styles.statLabel}>Likes</div>
      </div>
    </div>
  );
}