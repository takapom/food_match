package jwt

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go-qr-app/domain/service"
)

type jwtIssuer struct {
	secret    []byte
	issuer    string
	audience  []string
}

func NewJWTIssuer(secret string, issuer string, audience []string) service.JWTIssuer {
	return &jwtIssuer{
		secret:   []byte(secret),
		issuer:   issuer,
		audience: audience,
	}
}

type customClaims struct {
	jwt.RegisteredClaims
	Custom map[string]any `json:"custom,omitempty"`
}

func (j *jwtIssuer) Issue(subject string, ttl time.Duration, custom map[string]any) (string, time.Time, error) {
	now := time.Now()
	expiresAt := now.Add(ttl)

	claims := customClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   subject,
			Issuer:    j.issuer,
			Audience:  j.audience,
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
		Custom: custom,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(j.secret)
	if err != nil {
		return "", time.Time{}, fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, expiresAt, nil
}

func (j *jwtIssuer) ParseAndVerify(tokenString string) (service.Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &customClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return j.secret, nil
	})

	if err != nil {
		return service.Claims{}, fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return service.Claims{}, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*customClaims)
	if !ok {
		return service.Claims{}, errors.New("failed to parse claims")
	}

	return service.Claims{
		Registered: service.RegisteredClaims{
			Subject:   claims.Subject,
			Issuer:    claims.Issuer,
			Audience:  claims.Audience,
			ExpiresAt: claims.ExpiresAt.Time,
			IssuedAt:  claims.IssuedAt.Time,
			NotBefore: claims.NotBefore.Time,
			ID:        claims.ID,
		},
		Custom: claims.Custom,
	}, nil
}