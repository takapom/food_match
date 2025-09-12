package service

import "time"

type RegisteredClaims struct {
	Subject   string
	Issuer    string
	Audience  []string
	ExpiresAt time.Time
	IssuedAt  time.Time
	NotBefore time.Time
	ID        string
}

type Claims struct {
	Registered RegisteredClaims
	Custom     map[string]any
}

type JWTIssuer interface {
	Issue(subject string, ttl time.Duration, custom map[string]any) (token string, expiresAt time.Time, err error)
	ParseAndVerify(token string) (Claims, error)
}
