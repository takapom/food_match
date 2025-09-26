'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/auth/useAuth';
import styles from './page.module.css';

const heroHighlights = ['AIレコメンド', 'スワイプ操作', '限定クーポン'];

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, isAuthenticated } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/discover');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      router.push('/discover');
      return;
    }
    setShowError(true);
  };

  return (
    <div className={styles.appShell}>
      <div className={styles.backgroundGlowPrimary} />
      <div className={styles.backgroundGlowSecondary} />

      <header className={styles.header}>
        <div className={styles.branding}>
          <span className={styles.brandIcon}>🍽️</span>
          <div className={styles.brandText}>
            <span className={styles.brandLabel}>Food Matching</span>
            <span className={styles.brandSubtitle}>美味しい体験を、すぐ近くで</span>
          </div>
        </div>
        <Link href="/" className={styles.headerAction}>
          ホームに戻る
        </Link>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.formPanel}>
          <div className={styles.formHeader}>
            <span className={styles.formBadge}>ログイン</span>
            <h2 className={styles.formTitle}>メールアドレスでサインイン</h2>
            <p className={styles.formSubtitle}>入力は数秒で完了します。移動中でもサクッとログイン。</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={styles.input}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                パスワード
              </label>
              <div className={styles.passwordField}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={styles.input}
                  placeholder="パスワード"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkboxInput} /> ログイン状態を保持
              </label>
              <button type="button" className={styles.linkButton}>
                パスワードを忘れた方
              </button>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'ログイン中…' : 'ログイン'}
            </button>

            <div className={styles.secureNote}>
              <span className={styles.secureIcon}>🔒</span>
              <span>安全な通信でお届けします</span>
            </div>
          </form>

          <div className={styles.formDivider}>
            <span>または</span>
          </div>

          <ul className={styles.heroHighlights}>
            {heroHighlights.map((text) => (
              <li key={text} className={styles.heroHighlight}>
                {text}
              </li>
            ))}
          </ul>

          <p className={styles.signupPrompt}>
            アカウントをお持ちでない方は{' '}
            <Link href="/signup" className={styles.signupLink}>
              新規登録へ
            </Link>
          </p>
        </section>
      </main>

      {showError && (
        <div
          className={styles.modalOverlay}
          role="alertdialog"
          aria-modal="true"
          onClick={() => setShowError(false)}
        >
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h2 className={styles.modalTitle}>ログインに失敗しました</h2>
            <p className={styles.modalMessage}>
              {error || 'メールアドレスまたはパスワードをご確認のうえ、再度お試しください。'}
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalPrimaryButton} onClick={() => setShowError(false)}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
