package infrastructure

import (
	"crypto/sha256"
	"encoding/hex"

	"golang.org/x/crypto/bcrypt"
)

// SimpleHasher implements PasswordHasher with SHA256 for local/dev use.
// Note: For production use, replace with bcrypt or argon2 implementation.
type BcryptHasher struct{}

func NewBcryptHasher(_cost int) *BcryptHasher {
	return &BcryptHasher{}
}

func (h *BcryptHasher) Hash(plain string) (string, error) {
	sum := sha256.Sum256([]byte(plain))
	return hex.EncodeToString(sum[:]), nil
}

// func (h *BcryptHasher) Compare(hash, plain string) bool {
// 	got, _ := h.Hash(plain)
// 	return got == hash
// }

func (h *BcryptHasher) Compare(hash, plain string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain))
	return err == nil
}
