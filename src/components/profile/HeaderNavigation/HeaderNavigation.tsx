"use client";

import { useState } from 'react';
import styles from './HeaderNavigation.module.css';
import AddAccountIcon from '../../icons/AddAccountIcon';
import DropdownArrowIcon from '../../icons/DropdownArrowIcon';

interface HeaderNavigationProps {
  displayName: string;
}

export default function HeaderNavigation({ displayName }: HeaderNavigationProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddAccountClick = () => {
    console.log('Add account clicked');
  };

  const handleMenuClick = () => {
    console.log('Menu clicked');
  };

  return (
    <div className={styles.header}>
      <div className={styles.addAccountButton} onClick={handleAddAccountClick}>
        <AddAccountIcon width={22} height={22} color="#161722" />
      </div>
      
      <div className={styles.userSection} onClick={() => setShowDropdown(!showDropdown)}>
        <span className={styles.userName}>{displayName}</span>
        <DropdownArrowIcon width={10} height={7} color="#161722" />
      </div>

      <div className={styles.menuIcon} onClick={handleMenuClick}>
        <div className={styles.menuLines}></div>
        <div className={styles.menuLines}></div>
        <div className={styles.menuLines}></div>
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownItem} onClick={() => console.log('Switch Account clicked')}>
            Switch Account
          </div>
          <div className={styles.dropdownItem} onClick={() => console.log('Settings clicked')}>
            Settings
          </div>
          <div className={styles.dropdownItem} onClick={() => console.log('Privacy clicked')}>
            Privacy
          </div>
        </div>
      )}
    </div>
  );
}