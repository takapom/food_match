'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [currentCard, setCurrentCard] = useState(0);

  const sampleRestaurants = [
    {
      id: 1,
      name: 'イタリアン ビストロ',
      category: 'イタリアン',
      rating: 4.5,
      distance: '500m',
      image: 'italian'
    },
    {
      id: 2,
      name: '和食処 さくら',
      category: '和食',
      rating: 4.8,
      distance: '800m',
      image: 'japanese'
    },
    {
      id: 3,
      name: 'カフェ モカ',
      category: 'カフェ',
      rating: 4.2,
      distance: '300m',
      image: 'cafe'
    }
  ];

  const handleLike = () => {
    setCurrentCard((prev) => (prev + 1) % sampleRestaurants.length);
  };

  const handleDislike = () => {
    setCurrentCard((prev) => (prev + 1) % sampleRestaurants.length);
  };

  const handleSuperlike = () => {
    setCurrentCard((prev) => (prev + 1) % sampleRestaurants.length);
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundBlur} />

      <main className={styles.hero}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>🍔</div>
          <h1 className={styles.title}>食べ物とマッチングしよう！！</h1>
          <p className={styles.subtitle}>
            あなたの好みにぴったりの飲食店を、スワイプで簡単に見つけられます
          </p>
        </div>

        <div className={styles.cardStack}>
          {sampleRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className={styles.card}
              style={{
                display: index === currentCard || index === (currentCard + 1) % sampleRestaurants.length || index === (currentCard + 2) % sampleRestaurants.length ? 'block' : 'none',
                zIndex: index === currentCard ? 3 : index === (currentCard + 1) % sampleRestaurants.length ? 2 : 1,
                transform: index === currentCard ? 'rotate(0deg) scale(1)' : index === (currentCard + 1) % sampleRestaurants.length ? 'rotate(-5deg) scale(0.95)' : 'rotate(5deg) scale(0.9)',
                top: index === currentCard ? '0' : index === (currentCard + 1) % sampleRestaurants.length ? '10px' : '20px',
                opacity: index === currentCard ? 1 : index === (currentCard + 1) % sampleRestaurants.length ? 0.8 : 0.6
              }}
            >
              <div className={styles.cardImage}>
                <div className={styles.cardImageOverlay}>
                  <h2 className={styles.cardTitle}>{restaurant.name}</h2>
                  <span className={styles.cardCategory}>{restaurant.category}</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardInfo}>
                  <div className={styles.rating}>
                    <span className={styles.star}>⭐</span>
                    <span className={styles.ratingText}>{restaurant.rating}</span>
                  </div>
                  <span className={styles.distance}>📍 {restaurant.distance}</span>
                </div>
                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.actionButton} ${styles.dislikeButton}`}
                    onClick={handleDislike}
                    aria-label="パス"
                  >
                    ✕
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.superlikeButton}`}
                    onClick={handleSuperlike}
                    aria-label="スーパーいいね"
                  >
                    ⭐
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.likeButton}`}
                    onClick={handleLike}
                    aria-label="いいね"
                  >
                    ♥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className={styles.ctaSection}>
          <Link href="/discover" className={`${styles.ctaButton} ${styles.primaryButton}`}>
            ログイン
          </Link>
        </div> */}

        <div className={styles.ctaSection}>
          <Link href="/signup" className={`${styles.ctaButton} ${styles.primaryButton}`}>
            始める
          </Link>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>簡単マッチング</h3>
            <p className={styles.featureDescription}>
              スワイプするだけで、あなたの好みの飲食店が見つかります
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📍</div>
            <h3 className={styles.featureTitle}>近くのお店</h3>
            <p className={styles.featureDescription}>
              現在地から近い順におすすめの飲食店を表示します
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💝</div>
            <h3 className={styles.featureTitle}>お気に入り保存</h3>
            <p className={styles.featureDescription}>
              気になったお店はブックマークして後から確認できます
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}