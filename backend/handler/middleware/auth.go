package middleware

import (
	"context"
	"net/http"
	"strings"

	"go-qr-app/domain/service"
)

type contextKey string

const (
	UserIDKey contextKey = "userID"
)

type AuthMiddleware struct {
	jwtIssuer service.JWTIssuer
}

func NewAuthMiddleware(jwtIssuer service.JWTIssuer) *AuthMiddleware {
	return &AuthMiddleware{
		jwtIssuer: jwtIssuer,
	}
}

func (m *AuthMiddleware) Authenticate(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		token := parts[1]
		claims, err := m.jwtIssuer.ParseAndVerify(token)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, claims.Registered.Subject)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func GetUserID(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(UserIDKey).(string)
	return userID, ok
}