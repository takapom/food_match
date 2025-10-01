"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { useLogin } from "@/hooks/auth/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, error, isAuthenticated } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) router.replace("/discover");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await signup(email, password);
    if (ok) {
      // サインアップ後に確認メールが来るケースがあるため案内してリダイレクトする
      router.replace("/discover");
    } else {
      setShowError(true);
    }
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
            <span className={styles.formBadge}>新規登録</span>
            <h2 className={styles.formTitle}>メールアドレスでアカウント作成</h2>
            <p className={styles.formSubtitle}>数秒で登録できます。確認メールを送信します。</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>メールアドレス</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>パスワード</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "処理中…" : "アカウント作成"}
            </button>

            <p className={styles.signupPrompt}>
              既にアカウントをお持ちの方は{" "}
              <Link href="/login" className={styles.signupLink}>ログインへ</Link>
            </p>
          </form>
        </section>
      </main>

      {showError && (
        <div className={styles.modalOverlay} role="alertdialog" aria-modal="true" onClick={() => setShowError(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h2 className={styles.modalTitle}>エラー</h2>
            <p className={styles.modalMessage}>{error || "登録に失敗しました"}</p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalPrimaryButton} onClick={() => setShowError(false)}>閉じる</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}