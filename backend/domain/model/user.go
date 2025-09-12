package model

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID          string    `json:"id" gorm:"primaryKey;type:char(36)" db:"id"` //user_idとして機能
	DisplayName string    `json:"display_name" db:"display_name"`
    Email       string    `json:"email,omitempty" gorm:"type:varchar(191);uniqueIndex" db:"email"`
	AvatarURL   string    `json:"avatar_url,omitempty" db:"avatar_url"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

var (
	ErrInvalidDisplayName = errors.New("display name must be 1-50 characters")
	ErrInvalidEmail       = errors.New("invalid email format")
)

// BeforeCreate sets a UUID if ID is empty and initializes timestamps.
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == "" {
		u.ID = uuid.NewString()
	}
	now := time.Now().UTC()
	if u.CreatedAt.IsZero() {
		u.CreatedAt = now
	}
	u.UpdatedAt = now
	return nil
}

// Normalize prepares fields for persistence (e.g., email lowercasing).
func (u *User) Normalize() {
	u.DisplayName = strings.TrimSpace(u.DisplayName)
	u.Email = strings.ToLower(strings.TrimSpace(u.Email))
}

// Validate performs minimal domain validation.
func (u *User) Validate() error {
	if l := len(u.DisplayName); l < 1 || l > 50 {
		return ErrInvalidDisplayName
	}
	if u.Email != "" && !looksLikeEmail(u.Email) {
		return ErrInvalidEmail
	}
	return nil
}

// Touch updates the UpdatedAt timestamp.
func (u *User) Touch() { u.UpdatedAt = time.Now().UTC() }

// looksLikeEmail provides a lightweight email check without external deps.
func looksLikeEmail(s string) bool {
	// very small sanity check: one '@', non-empty local and domain parts, and a dot in domain
	at := strings.Count(s, "@") == 1
	if !at {
		return false
	}
	parts := strings.SplitN(s, "@", 2)
	if len(parts[0]) == 0 || len(parts[1]) < 3 {
		return false
	}
	return strings.Contains(parts[1], ".")
}
