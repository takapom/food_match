package infrastructure

import (
    "crypto/sha256"
    "encoding/hex"
    "strings"

    "golang.org/x/crypto/bcrypt"
)

// BcryptHasher implements PasswordHasher using bcrypt for hashing.
// For backward compatibility, Compare() falls back to legacy SHA-256
// comparison if the stored hash is not a bcrypt hash.
type BcryptHasher struct{ cost int }

func NewBcryptHasher(cost int) *BcryptHasher { return &BcryptHasher{cost: cost} }

// Hash creates a bcrypt hash of the given plaintext password.
func (h *BcryptHasher) Hash(plain string) (string, error) {
    // default to bcrypt.MinCost if an invalid cost is provided
    cost := h.cost
    if cost < bcrypt.MinCost || cost > bcrypt.MaxCost {
        cost = bcrypt.DefaultCost
    }
    b, err := bcrypt.GenerateFromPassword([]byte(plain), cost)
    if err != nil {
        return "", err
    }
    return string(b), nil
}

// Compare verifies a plaintext password against the stored hash.
// - If the stored hash looks like bcrypt ("$2a$", "$2b$", "$2y$"),
//   use bcrypt comparison.
// - Otherwise, fall back to legacy SHA-256(hex) comparison to keep
//   existing users able to log in.
func (h *BcryptHasher) Compare(hash, plain string) bool {
    if strings.HasPrefix(hash, "$2a$") || strings.HasPrefix(hash, "$2b$") || strings.HasPrefix(hash, "$2y$") {
        return bcrypt.CompareHashAndPassword([]byte(hash), []byte(plain)) == nil
    }
    // Legacy SHA-256 fallback
    sum := sha256.Sum256([]byte(plain))
    return hex.EncodeToString(sum[:]) == hash
}
