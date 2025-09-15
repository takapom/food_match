"use client";

import styles from './BottomNavigation.module.css';
import NavigationTab from '../NavigationTab/NavigationTab';
import HomeIcon from '../../icons/HomeIcon';
import SearchIcon from '../../icons/SearchIcon';
import PlusButtonIcon from '../../icons/PlusButtonIcon';
import MessageIcon from '../../icons/MessageIcon';
import AccountIcon from '../../icons/AccountIcon';
import { useRouter, usePathname } from 'next/navigation';

// 受け取り可能なタブ名を限定（型安全）
interface BottomNavigationProps {
  currentTab?: 'home' | 'discover' | 'inbox' | 'profile';
}

//URL→タブ名
function pathToTab(path: string): string {
  if (path === '/') return 'home';
  if (path.startsWith('/discover')) return 'discover';
  if (path.startsWith('/inbox')) return 'inbox';
  if (path.startsWith('/user_page') || path.startsWith('/profile')) return 'profile';
  return 'home';
}

//タブ名→パス(ボタンを押したら遷移)
const tabToPath: Record<string, string> = {
  home: '/discover',
  discover: '/discover',
  inbox: '/inbox',
  profile: '/user_page',
};

export default function BottomNavigation({ currentTab }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  // props で currentTab が渡された場合はそれを優先。無ければ URL から判定
  const activeTab = currentTab ?? pathToTab(pathname);

  const handleNav = (tab: string) => {
    const target = tabToPath[tab];
    if (target && target !== pathname) router.push(target);
  };

  return (
    <div className={styles.bottomNav}>
      <NavigationTab
        icon={<HomeIcon width={23} height={21} color={activeTab === 'home' ? '#161722' : '#8a8b8f'} />}
        label="Home"
        isActive={activeTab === 'home'}
        onClick={() => handleNav('home')}
      />

      <NavigationTab
        icon={<SearchIcon width={20} height={21} color={activeTab === 'discover' ? '#161722' : '#8a8b8f'} />}
        label="Discover"
        isActive={activeTab === 'discover'}
        onClick={() => handleNav('discover')}
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
        onClick={() => handleNav('inbox')}
      />

      <NavigationTab
        icon={<AccountIcon width={19} height={21} color={activeTab === 'profile' ? '#161722' : '#8a8b8f'} />}
        label="Me"
        isActive={activeTab === 'profile'}
        onClick={() => handleNav('profile')}
      />

      <div className={styles.indicator}></div>
    </div>
  );
}
