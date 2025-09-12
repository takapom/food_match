'use client';

import { useEffect, useState, useRef } from 'react';
import { type Shop } from '@/lib/api/restaurants';
import UserIcon from '@/components/ui/UserIcon/UserIcon';
import styles from './page.module.css';

export default function Discover() {
    const [restaurants, setRestaurants] = useState<Shop[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/restaurants?count=10');

            if (!response.ok) {
                throw new Error(`データの取得に失敗しました`);
            }

            const data = await response.json();

            console.log("data：", data)

            if (data.error) {
                throw new Error(data.message || 'データの取得に失敗しました');
            }

            if (Array.isArray(data)) {
                setRestaurants(data);
                setError(null);
            } else {
                throw new Error('データ形式が無効です');
            }
        } catch (err) {
            console.error('Failed to fetch restaurants:', err);
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const handleReload = () => {
        window.location.reload();
    };

    const handleAction = (action: 'pass' | 'like' | 'superlike') => {
        if (isAnimating) return;

        setIsAnimating(true);

        // アニメーション方向を決定
        let animationClass = '';
        switch (action) {
            case 'pass':
                animationClass = styles.swipeLeft;
                break;
            case 'like':
                animationClass = styles.swipeRight;
                break;
            case 'superlike':
                animationClass = styles.swipeUp;
                break;
        }

        // アニメーションを適用
        const cardElement = containerRef.current?.querySelector(`.${styles.cardSlide}`) as HTMLElement;
        if (cardElement) {
            cardElement.classList.add(animationClass);
        }

        setTimeout(() => {
            // アニメーションクラスをクリア
            if (cardElement) {
                cardElement.classList.remove(animationClass);
            }

            // スワイプ状態をリセット
            setTranslateX(0);

            if (currentIndex < restaurants.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                // 最後のカードの場合、新しいレストランを読み込む
                loadRestaurants();
                setCurrentIndex(0);
            }
            setIsAnimating(false);
        }, 300);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < restaurants.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // マウスイベント
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isAnimating) return;
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || isAnimating) return;
        const diff = e.clientX - startX;
        setTranslateX(diff);
    };

    const handleMouseUp = () => {
        if (!isDragging || isAnimating) return;
        setIsDragging(false);

        // スワイプ判定
        if (Math.abs(translateX) > 80) {
            if (translateX > 0) {
                handleAction('like');
            } else {
                handleAction('pass');
            }
        } else if (translateX > 50) {
            handlePrevious();
        } else if (translateX < -50) {
            handleNext();
        }
        setTranslateX(0);
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleMouseUp();
        }
    };

    // タッチイベント
    const handleTouchStart = (e: React.TouchEvent) => {
        if (isAnimating) return;
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || isAnimating) return;
        const diff = e.touches[0].clientX - startX;
        setTranslateX(diff);
    };

    const handleTouchEnd = () => {
        handleMouseUp();
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.modernHeader}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logo}>🍽️</div>
                        <h1 className={styles.appTitle}>FoodMatch</h1>
                    </div>
                    <UserIcon size="medium" />
                </div>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p className={styles.loadingText}>美味しいお店を探しています...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.modernHeader}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logo}>🍽️</div>
                        <h1 className={styles.appTitle}>FoodMatch</h1>
                    </div>
                    <UserIcon size="medium" />
                </div>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>😞</div>
                    <h2 className={styles.errorTitle}>接続できませんでした</h2>
                    <p className={styles.errorMessage}>データの取得に失敗しました</p>
                    <button onClick={handleReload} className={styles.modernRetryButton}>
                        もう一度試す
                    </button>
                </div>
            </div>
        );
    }

    if (restaurants.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.modernHeader}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logo}>🍽️</div>
                        <h1 className={styles.appTitle}>FoodMatch</h1>
                    </div>
                    <UserIcon size="medium" />
                </div>
                <div className={styles.emptyContainer}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <h2 className={styles.emptyTitle}>お店が見つかりませんでした</h2>
                    <p className={styles.emptyMessage}>別のエリアで探してみましょう</p>
                    <button onClick={handleReload} className={styles.modernRetryButton}>
                        読み込む
                    </button>
                </div>
            </div>
        );
    }

    const currentRestaurant = restaurants[currentIndex];

    return (
        <div className={styles.container}>
            {/* モダンヘッダー */}
            <div className={styles.modernHeader}>
                <div className={styles.logoContainer}>
                    <div className={styles.logo}>🍽️</div>
                    <h1 className={styles.appTitle}>FoodMatch</h1>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.filterButton}>
                        <span>⚙️</span>
                    </button>
                    <UserIcon size="medium" />
                </div>
            </div>

            {/* カードスタック */}
            <div className={styles.cardStackContainer}>
                <div className={styles.cardStack}>
                    {/* 次のカード（背景） */}
                    {restaurants[currentIndex + 1] && (
                        <div key={restaurants[currentIndex + 1].id} className={styles.backgroundCard}>
                            <div className={styles.cardImageContainer}>
                                <img
                                    src={restaurants[currentIndex + 1].photo.pc.l || restaurants[currentIndex + 1].photo.pc.m}
                                    alt={restaurants[currentIndex + 1].name}
                                    className={styles.cardImage}
                                />
                                {/* 背景カード用の情報オーバーレイ */}
                                <div className={styles.cardOverlay}>
                                    <div className={styles.restaurantBadge}>
                                        <span className={styles.badgeText}>{restaurants[currentIndex + 1].genre.name}</span>
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <h2 className={styles.restaurantName}>{restaurants[currentIndex + 1].name}</h2>
                                        <div className={styles.restaurantDetails}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailIcon}>📍</span>
                                                <span className={styles.detailText}>{restaurants[currentIndex + 1].access}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailIcon}>💰</span>
                                                <span className={styles.detailText}>{restaurants[currentIndex + 1].budget.name}</span>
                                            </div>
                                            {restaurants[currentIndex + 1].catch && (
                                                <div className={styles.catchPhrase}>
                                                    {restaurants[currentIndex + 1].catch}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* メインカード */}
                    <div
                        key={currentRestaurant.id}
                        className={styles.mainCard}
                        ref={containerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            transform: `translateX(${translateX}px) rotate(${translateX * 0.1}deg)`,
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                    >
                        <div className={styles.cardSlide}>
                            <div className={styles.cardImageContainer}>
                                <img
                                    src={currentRestaurant.photo.pc.l || currentRestaurant.photo.pc.m}
                                    alt={currentRestaurant.name}
                                    className={styles.cardImage}
                                />

                                {/* スワイプインジケーター */}
                                <div
                                    className={`${styles.swipeIndicator} ${styles.passIndicator} ${translateX < -50 ? styles.visible : ''
                                        }`}
                                >
                                    PASS
                                </div>
                                <div
                                    className={`${styles.swipeIndicator} ${styles.likeIndicator} ${translateX > 50 ? styles.visible : ''
                                        }`}
                                >
                                    LIKE
                                </div>

                                {/* カード情報オーバーレイ */}
                                <div className={styles.cardOverlay}>
                                    <div className={styles.restaurantBadge}>
                                        <span className={styles.badgeText}>{currentRestaurant.genre.name}</span>
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <h2 className={styles.restaurantName}>{currentRestaurant.name}</h2>
                                        <div className={styles.restaurantDetails}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailIcon}>📍</span>
                                                <span className={styles.detailText}>{currentRestaurant.access}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailIcon}>💰</span>
                                                <span className={styles.detailText}>{currentRestaurant.budget.name}</span>
                                            </div>
                                            {currentRestaurant.catch && (
                                                <div className={styles.catchPhrase}>
                                                    {currentRestaurant.catch}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* アクションボタン */}
            <div className={styles.actionButtons}>
                <button
                    className={`${styles.actionButton} ${styles.passButton}`}
                    onClick={() => handleAction('pass')}
                    disabled={isAnimating}
                >
                    <span className={styles.actionIcon}>✕</span>
                </button>

                <button
                    className={`${styles.actionButton} ${styles.superlikeButton}`}
                    onClick={() => handleAction('superlike')}
                    disabled={isAnimating}
                >
                    <span className={styles.actionIcon}>⭐</span>
                </button>

                <button
                    className={`${styles.actionButton} ${styles.likeButton}`}
                    onClick={() => handleAction('like')}
                    disabled={isAnimating}
                >
                    <span className={styles.actionIcon}>♥</span>
                </button>
            </div>

            {/* プログレスインジケーター */}
            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((currentIndex + 1) / restaurants.length) * 100}%` }}
                    ></div>
                </div>
                <span className={styles.progressText}>
                    {currentIndex + 1} / {restaurants.length}
                </span>
            </div>
        </div>
    );
}