import React from 'react';
import styles from './RestaurantCard.module.css';
import type { Shop } from '../../../lib/api/restaurants';

interface RestaurantCardProps {
  shop: Shop;
}

export default function RestaurantCard({ shop }: RestaurantCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={shop.photo.pc.l || shop.photo.pc.m || '/placeholder.jpg'}
          alt={shop.name}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.name}>{shop.name}</h2>

        <div className={styles.info}>
          <div className={styles.badge}>{shop.genre.name}</div>
          <div className={styles.budget}>
            予算: {shop.budget.average || '情報なし'}
          </div>
        </div>

        <p className={styles.catch}>{shop.catch}</p>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>エリア:</span>
            <span>{shop.large_area.name} - {shop.middle_area.name}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>アクセス:</span>
            <span>{shop.access}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>住所:</span>
            <span>{shop.address}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>営業時間:</span>
            <span>{shop.open || '情報なし'}</span>
          </div>

          {shop.close && (
            <div className={styles.detailItem}>
              <span className={styles.label}>定休日:</span>
              <span>{shop.close}</span>
            </div>
          )}
        </div>

        <div className={styles.facilities}>
          {shop.wifi === 'あり' && <span className={styles.facility}>WiFi</span>}
          {shop.private_room === 'あり' && <span className={styles.facility}>個室</span>}
          {shop.card === 'あり' && <span className={styles.facility}>カード可</span>}
          {shop.non_smoking === '全面禁煙' && <span className={styles.facility}>禁煙</span>}
          {shop.parking && <span className={styles.facility}>駐車場</span>}
          {shop.lunch === 'あり' && <span className={styles.facility}>ランチ</span>}
        </div>

        <a
          href={shop.urls.pc}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          詳細を見る →
        </a>
      </div>
    </div>
  );
}