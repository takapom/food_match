import styles from './CreateVideoCard.module.css';

export default function CreateVideoCard() {
  const handleClick = () => {
    console.log('Create video card clicked');
    // 遷移先は設定不要とのことなので、ログのみ
  };

  return (
    <div className={styles.createCard} onClick={handleClick}>
      <div className={styles.content}>
        <div className={styles.title}>Tap to create</div>
      </div>
    </div>
  );
}