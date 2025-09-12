package model

import "time"

// ユーザーの認証情報（パスワードはハッシュのみを保持）
type Credential struct {
    UserID       string    `json:"user_id" gorm:"primaryKey;type:char(36);not null" db:"user_id"`
    PasswordHash string    `json:"password_hash" gorm:"type:varchar(255);not null" db:"password_hash"`
    CreatedAt    time.Time `json:"created_at" db:"created_at"`
    UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// 更新時刻を更新（保存直前に呼ぶ想定）
func (c *Credential) Touch() { c.UpdatedAt = time.Now().UTC() }
