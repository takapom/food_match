import { ReactNode } from 'react';
import styles from './NavigationTab.module.css';

interface NavigationTabProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function NavigationTab({ icon, label, isActive = false, onClick }: NavigationTabProps) {
  return (
    <div 
      className={`${styles.tab} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.icon}>
        {icon}
      </div>
      <div className={styles.label}>
        {label}
      </div>
    </div>
  );
}