"use client";

import { useState } from 'react';
import styles from './BottomNavigation.module.css';
import NavigationTab from '../NavigationTab/NavigationTab';
import HomeIcon from '../../icons/HomeIcon';
import SearchIcon from '../../icons/SearchIcon';
import PlusButtonIcon from '../../icons/PlusButtonIcon';
import MessageIcon from '../../icons/MessageIcon';
import AccountIcon from '../../icons/AccountIcon';

interface BottomNavigationProps {
  currentTab: string;
}

export default function BottomNavigation({ currentTab }: BottomNavigationProps) {
  const [activeTab, setActiveTab] = useState(currentTab);

  return (
    <div className={styles.bottomNav}>
      <NavigationTab
        icon={<HomeIcon width={23} height={21} color={activeTab === 'home' ? '#161722' : '#8a8b8f'} />}
        label="Home"
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      />
      
      <NavigationTab
        icon={<SearchIcon width={20} height={21} color={activeTab === 'discover' ? '#161722' : '#8a8b8f'} />}
        label="Discover"
        isActive={activeTab === 'discover'}
        onClick={() => setActiveTab('discover')}
      />
      
      <NavigationTab
        icon={<PlusButtonIcon width={43} height={28} color="#161722" />}
        label=""
        isActive={false}
        onClick={() => console.log('Create new content')}
      />
      
      <NavigationTab
        icon={<MessageIcon width={20} height={21} color={activeTab === 'inbox' ? '#161722' : '#86878b'} />}
        label="Inbox"
        isActive={activeTab === 'inbox'}
        onClick={() => setActiveTab('inbox')}
      />
      
      <NavigationTab
        icon={<AccountIcon width={19} height={21} color={activeTab === 'profile' ? '#161722' : '#8a8b8f'} />}
        label="Me"
        isActive={activeTab === 'profile'}
        onClick={() => setActiveTab('profile')}
      />
      
      <div className={styles.indicator}></div>
    </div>
  );
}