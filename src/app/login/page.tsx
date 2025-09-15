'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useLogin } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, isAuthenticated, token } = useLogin();

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/discover")
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result) {
      console.log('YOUR TOKEN:', result.token);
      router.push('/discover');
    } else {
      setShowError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>ログイン</h1>
          <p className={styles.subtitle}>アカウントにサインインしてください</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ...existing code... */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="example@email.com"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>パスワード</label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="パスワードを入力"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div className={styles.options}>
            <label className={styles.checkbox}>
              <input type="checkbox" /> ログイン状態を保持する
            </label>
            <a href="#" className={styles.forgotPassword}>パスワードを忘れた方</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className={styles.divider}><span>または</span></div>

        <div className={styles.socialButtons}>
          {/* ...existing code... */}
        </div>

        <p className={styles.signupLink}>
          アカウントをお持ちでない方は <a href="/signup">新規登録</a>
        </p>
      </div>

      {showError && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowError(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>ログインに失敗しました</h2>
            <p className={styles.modalMessage}>
              {error || 'メールアドレスまたはパスワードが間違っています。'}
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalPrimaryButton}
                onClick={() => setShowError(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}