package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"go-qr-app/domain/service"
	"go-qr-app/usecase"
)

type AuthHandler struct {
	jwtIssuer service.JWTIssuer
	authUC    *usecase.AuthUsecase
}

func NewAuthHandler(jwtIssuer service.JWTIssuer, authUC *usecase.AuthUsecase) *AuthHandler {
	return &AuthHandler{
		jwtIssuer: jwtIssuer,
		authUC:    authUC,
	}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
}

// シンプルなログイン処理（実際の本番環境ではパスワードの検証が必要）
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	token, expiresAt, err := h.authUC.Login(req.Email, req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token":      token,
		"expires_at": expiresAt,
	})
}
