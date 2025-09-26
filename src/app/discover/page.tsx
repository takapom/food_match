'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { MouseEvent, TouchEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    AccessTimeRounded,
    AttachMoneyRounded,
    BoltRounded,
    ChatBubbleRounded,
    CloseRounded,
    ExploreRounded,
    FavoriteRounded,
    HomeRounded,
    LocationOnRounded,
    ManageSearchRounded,
    PersonRounded,
    PlaceRounded,
    RamenDiningRounded,
    RestaurantMenuRounded,
    SentimentVeryDissatisfiedRounded,
    TuneRounded
} from '@mui/icons-material';
import UserIcon from '@/components/ui/UserIcon/UserIcon';
import { type Shop } from '@/lib/api/restaurants';
import styles from './page.module.css';

type FilterKey = 'location' | 'availability' | 'budget';

type FilterOption = {
    value: string;
    hint: string;
};

type FilterConfig = {
    key: FilterKey;
    label: string;
    icon: ReactNode;
    options: FilterOption[];
};

const FALLBACK_RESTAURANT_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%23747474'%3ENo%20Image%3C/text%3E%3C/svg%3E";

const filterConfigs: FilterConfig[] = [
    {
        key: 'location',
        label: '現在地',
        icon: <LocationOnRounded fontSize="inherit" />,
        options: [
            { value: '梅田', hint: '大型商業施設と夜景ディナーが楽しめる' },
            { value: '天王寺', hint: 'あべのハルカス周辺の多彩なグルメ' },
            { value: '難波', hint: 'ミナミの活気ある食スポットをチェック' },
            { value: '吹田', hint: '万博記念公園エリアの落ち着いた名店' }
        ]
    },
    {
        key: 'availability',
        label: '営業状況',
        icon: <AccessTimeRounded fontSize="inherit" />,
        options: [
            { value: 'OPEN NOW', hint: '今すぐ入店できるお店' },
            { value: '予約受付中', hint: '当日予約可能なレストラン' },
            { value: 'テイクアウト可', hint: '持ち帰りメニューを提供' }
        ]
    },
    {
        key: 'budget',
        label: '予算',
        icon: <AttachMoneyRounded fontSize="inherit" />,
        options: [
            { value: '1,000円', hint: 'サクッと立ち寄れるワンコイン＋α' },
            { value: '3,000円', hint: 'デイリーに使えるちょっと贅沢ライン' },
            { value: '5,000円', hint: 'ゆったり食事を楽しむミドルレンジ' }
        ]
    }
];

type SwipeAction = 'pass' | 'like' | 'superlike';

type StateCardOptions = {
    icon: ReactNode;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
};

export default function Discover() {
    const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'auth_token';

    const [restaurants, setRestaurants] = useState<Shop[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);
    const [filterSelections, setFilterSelections] = useState<Record<FilterKey, string>>({
        location: '梅田',
        availability: 'OPEN NOW',
        budget: '3,000円'
    });
    const [isClient, setIsClient] = useState(false);

    const router = useRouter();
    const activeCardRef = useRef<HTMLElement | null>(null);

    const activeFilterConfig = useMemo(
        () => (activeFilter ? filterConfigs.find((config) => config.key === activeFilter) ?? null : null),
        [activeFilter]
    );

    const getAuthTokenFromCookie = useCallback(() => {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`));
        return match ? decodeURIComponent(match[1]) : null;
    }, [AUTH_COOKIE_NAME]);

    const loadRestaurants = useCallback(async () => {
        try {
            setLoading(true);

            const token = getAuthTokenFromCookie();
            if (!token) {
                router.push('/login');
                return;
            }

            const selectionLocation = filterSelections.location;
            const queryParams = new URLSearchParams({
                count: '10',
                keyword: selectionLocation,
            });

            const response = await fetch(`/api/restaurants?${queryParams.toString()}`);

            if (!response.ok) {
                throw new Error('データの取得に失敗しました');
            }

            const data = await response.json();

            if (data?.error) {
                throw new Error(data.message || 'データの取得に失敗しました');
            }

            if (Array.isArray(data)) {
                setRestaurants(data);
                setError(null);
                setCurrentIndex(0);
            } else {
                throw new Error('データ形式が無効です');
            }
        } catch (err) {
            console.error('Failed to fetch restaurants:', err);
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }, [filterSelections.location, getAuthTokenFromCookie, router]);

    useEffect(() => {
        void loadRestaurants();
    }, [loadRestaurants]);

    useEffect(() => {
        const token = getAuthTokenFromCookie();
        if (!token) {
            router.push('/login');
        }
    }, [getAuthTokenFromCookie, router]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const body = document.body;
        if (activeFilter) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
        return () => {
            body.style.overflow = '';
        };
    }, [activeFilter, isClient]);

    const handleReload = useCallback(() => {
        void loadRestaurants();
    }, [loadRestaurants]);

    const handleSelectFilter = (key: FilterKey, value: string) => {
        setFilterSelections((prev) => ({
            ...prev,
            [key]: value
        }));
        setActiveFilter(null);
    };

    const advanceCard = () => {
        if (currentIndex < restaurants.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            return;
        }
        void loadRestaurants();
    };

    const handleAction = (action: SwipeAction) => {
        if (isAnimating || restaurants.length === 0) return;

        setIsAnimating(true);

        let animationClass = '';
        if (action === 'pass') animationClass = styles.swipeLeft;
        if (action === 'like') animationClass = styles.swipeRight;
        if (action === 'superlike') animationClass = styles.swipeUp;

        const cardElement = activeCardRef.current?.querySelector(`.${styles.cardSlide}`) as HTMLElement | null;
        if (cardElement && animationClass) {
            cardElement.classList.add(animationClass);
        }

        setTimeout(() => {
            if (cardElement && animationClass) {
                cardElement.classList.remove(animationClass);
            }
            setTranslateX(0);
            advanceCard();
            setIsAnimating(false);
        }, 320);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < restaurants.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleMouseDown = (event: MouseEvent) => {
        if (isAnimating) return;
        setIsDragging(true);
        setStartX(event.clientX);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging || isAnimating) return;
        const diff = event.clientX - startX;
        setTranslateX(diff);
    };

    const handleMouseUp = () => {
        if (!isDragging || isAnimating) return;
        setIsDragging(false);
        handleGestureRelease();
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            handleGestureRelease();
        }
    };

    const handleTouchStart = (event: TouchEvent) => {
        if (isAnimating) return;
        setIsDragging(true);
        setStartX(event.touches[0].clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
        if (!isDragging || isAnimating) return;
        const diff = event.touches[0].clientX - startX;
        setTranslateX(diff);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        handleGestureRelease();
    };

    const handleGestureRelease = () => {
        if (Math.abs(translateX) > 100) {
            handleAction(translateX > 0 ? 'like' : 'pass');
        } else if (translateX > 70) {
            handlePrevious();
            setTranslateX(0);
        } else if (translateX < -70) {
            handleNext();
            setTranslateX(0);
        } else {
            setTranslateX(0);
        }
    };

    const activeRestaurant = restaurants[currentIndex];
    const upcomingRestaurant = restaurants[currentIndex + 1];
    const hasRestaurants = Boolean(activeRestaurant);
    const progressValue = hasRestaurants ? ((currentIndex + 1) / restaurants.length) * 100 : 0;
    const candidateSummary = restaurants.length ? `候補：${restaurants.length}件` : '候補を探索中';

    const renderStateCard = ({ icon, title, message, actionLabel, onAction }: StateCardOptions) => (
        <section className={styles.stateCard}>
            <div className={styles.stateIcon}>{icon}</div>
            <h2 className={styles.stateTitle}>{title}</h2>
            <p className={styles.stateMessage}>{message}</p>
            {actionLabel && onAction && (
                <button type="button" className={styles.stateButton} onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </section>
    );

    return (
        <div className={styles.appShell}>
            <div className={styles.backgroundGlowPrimary} />
            <div className={styles.backgroundGlowSecondary} />

            <header className={styles.header}>
                <div className={styles.branding}>
                    <span className={styles.brandIcon}>
                        <RamenDiningRounded fontSize="inherit" />
                    </span>
                    <div className={styles.brandText}>
                        <span className={styles.brandLabel}>Food Matching</span>
                        <span className={styles.brandSubtitle}>近くのおすすめを発見</span>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button type="button" className={styles.headerButton}>
                        <TuneRounded className={styles.headerButtonIcon} fontSize="inherit" />
                    </button>
                    <UserIcon size="medium" />
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className={styles.heroSection}>
                    {/* <h1 className={styles.heroTitle}>「食べたい」をスワイプで</h1>
                    <p className={styles.heroSubtitle}>
                        スキマ時間などでスワイプするだけ。店選びをすばやく。
                    </p> */}
                    <div className={styles.filterChips}>
                        {filterConfigs.map((filter) => {
                            const isActive = activeFilter === filter.key;
                            return (
                                <button
                                    key={filter.key}
                                    type="button"
                                    className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ''
                                        }`}
                                    onClick={() =>
                                        setActiveFilter((prev) => (prev === filter.key ? null : filter.key))
                                    }
                                    aria-pressed={isActive}
                                    aria-haspopup="dialog"
                                    aria-expanded={isActive}
                                >
                                    <span className={styles.filterButtonIcon}>{filter.icon}</span>
                                    <span className={styles.filterButtonBody}>
                                        <span className={styles.filterButtonLabel}>{filter.label}</span>
                                        <span className={styles.filterButtonValue}>{filterSelections[filter.key]}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div className={styles.filterStatus}>{candidateSummary}</div>
                </section>

                {isClient && activeFilter && activeFilterConfig &&
                    createPortal(
                        <div className={styles.filterOverlay} onClick={() => setActiveFilter(null)}>
                            <div
                                className={styles.filterModal}
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby={`discover-filter-${activeFilterConfig.key}`}
                                onClick={(event) => event.stopPropagation()}
                            >
                                <div className={styles.filterModalHeader}>
                                    <div className={styles.filterModalTitle}>
                                        <span className={styles.filterModalIcon}>{activeFilterConfig.icon}</span>
                                        <div>
                                            <p
                                                id={`discover-filter-${activeFilterConfig.key}`}
                                                className={styles.filterModalLabel}
                                            >
                                                {activeFilterConfig.label}
                                            </p>
                                            <p className={styles.filterModalCaption}>条件を微調整してさらにマッチング精度をアップ</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.filterModalClose}
                                        onClick={() => setActiveFilter(null)}
                                        aria-label="フィルターを閉じる"
                                    >
                                        <CloseRounded fontSize="small" />
                                    </button>
                                </div>
                                <div className={styles.filterOptions}>
                                    {activeFilterConfig.options.map((option) => {
                                        const isSelected = filterSelections[activeFilterConfig.key] === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                className={`${styles.filterOption} ${isSelected ? styles.filterOptionSelected : ''
                                                    }`}
                                                onClick={() => handleSelectFilter(activeFilterConfig.key, option.value)}
                                            >
                                                <span className={styles.filterOptionValue}>{option.value}</span>
                                                <span className={styles.filterOptionHint}>{option.hint}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}

                {loading &&
                    renderStateCard({
                        icon: <RestaurantMenuRounded fontSize="inherit" />,
                        title: '候補を探索中',
                        message: '美味しいお店を見つけています…'
                    })}

                {!loading && error &&
                    renderStateCard({
                        icon: <SentimentVeryDissatisfiedRounded fontSize="inherit" />,
                        title: '読み込みに失敗しました',
                        message: '通信環境をご確認のうえ、もう一度お試しください。',
                        actionLabel: '再読み込み',
                        onAction: handleReload
                    })}

                {!loading && !error && !hasRestaurants &&
                    renderStateCard({
                        icon: <ManageSearchRounded fontSize="inherit" />,
                        title: '近くに候補が見つかりません',
                        message: '条件をゆるめるか、別のエリアを試してみましょう。',
                        actionLabel: '再検索',
                        onAction: handleReload
                    })}

                {!loading && !error && hasRestaurants && (
                    <section className={styles.cardSection}>
                        <div className={styles.cardDeck}>
                            {upcomingRestaurant && (
                                <article className={`${styles.card} ${styles.cardSecondary}`}>
                                    <div className={styles.cardImageContainer}>
                                        <Image
                                            src={
                                                upcomingRestaurant.photo.pc.l ||
                                                upcomingRestaurant.photo.pc.m ||
                                                FALLBACK_RESTAURANT_IMAGE
                                            }
                                            alt={upcomingRestaurant.name}
                                            fill
                                            className={styles.cardImage}
                                            sizes="(max-width: 768px) 80vw, 30vw"
                                            unoptimized
                                        />
                                        <div className={styles.cardGradient} />
                                        <div className={styles.cardOverlay}>
                                            <div className={styles.cardBadgeGroup}>
                                                <span className={`${styles.cardBadge} ${styles.cardBadgePrimary}`}>
                                                    {upcomingRestaurant.genre.name}
                                                </span>
                                                <span className={`${styles.cardBadge} ${styles.cardBadgeSecondary}`}>
                                                    {upcomingRestaurant.budget.name}
                                                </span>
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <h2 className={styles.restaurantName}>{upcomingRestaurant.name}</h2>
                                                <div className={styles.restaurantDetails}>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailIcon}>
                                                            <PlaceRounded fontSize="inherit" />
                                                        </span>
                                                        <span className={styles.detailText}>{upcomingRestaurant.access}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )}

                            <article
                                ref={activeCardRef}
                                className={`${styles.card} ${styles.cardPrimary}`}
                                style={{ transform: `translateX(${translateX}px) rotate(${translateX / 25}deg)` }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <div className={styles.cardSlide}>
                                    <div className={styles.cardImageContainer}>
                                        <Image
                                            src={
                                                activeRestaurant.photo.pc.l ||
                                                activeRestaurant.photo.pc.m ||
                                                FALLBACK_RESTAURANT_IMAGE
                                            }
                                            alt={activeRestaurant.name}
                                            fill
                                            className={styles.cardImage}
                                            sizes="(max-width: 768px) 80vw, 50vw"
                                            priority
                                            unoptimized
                                        />
                                        <div className={styles.cardGradient} />

                                        <div
                                            className={`${styles.swipeIndicator} ${styles.passIndicator} ${translateX < -60 ? styles.visible : ''}`}
                                        >
                                            PASS
                                        </div>
                                        <div
                                            className={`${styles.swipeIndicator} ${styles.likeIndicator} ${translateX > 60 ? styles.visible : ''}`}
                                        >
                                            LIKE
                                        </div>

                                        <div className={styles.cardOverlay}>
                                            <div className={styles.cardBadgeGroup}>
                                                <span className={`${styles.cardBadge} ${styles.cardBadgePrimary}`}>
                                                    {activeRestaurant.genre.name}
                                                </span>
                                                <span className={`${styles.cardBadge} ${styles.cardBadgeSecondary}`}>
                                                    {activeRestaurant.budget.name}
                                                </span>
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <h2 className={styles.restaurantName}>{activeRestaurant.name}</h2>
                                                <div className={styles.restaurantDetails}>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailIcon}>
                                                            <PlaceRounded fontSize="inherit" />
                                                        </span>
                                                        <span className={styles.detailText}>{activeRestaurant.access}</span>
                                                    </div>
                                                    {activeRestaurant.catch && (
                                                        <div className={styles.catchPhrase}>{activeRestaurant.catch}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <div className={styles.actionRing}>
                            <button
                                type="button"
                                className={`${styles.actionButton} ${styles.actionPass}`}
                                onClick={() => handleAction('pass')}
                                disabled={isAnimating}
                            >
                                <CloseRounded fontSize="medium" />
                            </button>
                            <button
                                type="button"
                                className={`${styles.actionButton} ${styles.actionSuperLike}`}
                                onClick={() => handleAction('superlike')}
                                disabled={isAnimating}
                            >
                                <BoltRounded fontSize="medium" />
                            </button>
                            <button
                                type="button"
                                className={`${styles.actionButton} ${styles.actionLike}`}
                                onClick={() => handleAction('like')}
                                disabled={isAnimating}
                            >
                                <FavoriteRounded fontSize="medium" />
                            </button>
                        </div>

                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${progressValue}%` }} />
                            </div>
                            <span className={styles.progressText}>
                                {currentIndex + 1} / {restaurants.length}
                            </span>
                        </div>
                    </section>
                )}
            </main>

            <nav className={styles.bottomNav} aria-label="メインナビゲーション">
                <button type="button" className={styles.navButton}>
                    <span className={styles.navIcon}>
                        <HomeRounded fontSize="inherit" />
                    </span>
                    <span className={styles.navLabel}>ホーム</span>
                </button>
                <button type="button" className={`${styles.navButton} ${styles.navButtonActive}`}>
                    <span className={styles.navIcon}>
                        <ExploreRounded fontSize="inherit" />
                    </span>
                    <span className={styles.navLabel}>ディスカバー</span>
                </button>
                <button type="button" className={styles.navButton}>
                    <span className={styles.navIcon}>
                        <ChatBubbleRounded fontSize="inherit" />
                    </span>
                    <span className={styles.navLabel}>みんなの声</span>
                </button>
                <button type="button" className={styles.navButton}>
                    <span className={styles.navIcon}>
                        <PersonRounded fontSize="inherit" />
                    </span>
                    <span className={styles.navLabel}>マイページ</span>
                </button>
            </nav>
        </div>
    );
}
