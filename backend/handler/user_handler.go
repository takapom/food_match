package handler

import (
    "encoding/json"
    "net/http"

    "go-qr-app/domain/repository"
    mw "go-qr-app/handler/middleware"
)

type UserHandler struct {
    users repository.UserRepository
}

func NewUserHandler(users repository.UserRepository) *UserHandler {
    return &UserHandler{users: users}
}

// Profile handles GET (fetch my profile) and PUT (update my profile)
func (h *UserHandler) Profile(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        h.getProfile(w, r)
    case http.MethodPut:
        h.updateProfile(w, r)
    default:
        http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
    }
}

func (h *UserHandler) getProfile(w http.ResponseWriter, r *http.Request) {
    userID, ok := mw.GetUserID(r.Context())
    if !ok || userID == "" {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }

    u, err := h.users.FindByID(userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    if u == nil {
        http.Error(w, "user not found", http.StatusNotFound)
        return
    }

    // Shape response to what frontend expects (provide reasonable defaults)
    resp := map[string]any{
        "id":            u.ID,
        "username":      u.DisplayName, // no separate username in model; reuse
        "displayName":   u.DisplayName,
        "email":         u.Email,
        "avatar":        u.AvatarURL,
        "followingCount": 0,
        "followersCount": 0,
        "likesCount":     0,
        "hasBio":         false,
        "createdAt":      u.CreatedAt,
    }

    w.Header().Set("Content-Type", "application/json")
    _ = json.NewEncoder(w).Encode(resp)
}

func (h *UserHandler) updateProfile(w http.ResponseWriter, r *http.Request) {
    userID, ok := mw.GetUserID(r.Context())
    if !ok || userID == "" {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }

    u, err := h.users.FindByID(userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    if u == nil {
        http.Error(w, "user not found", http.StatusNotFound)
        return
    }

    var body struct {
        DisplayName *string `json:"displayName"`
        Avatar      *string `json:"avatar"`
    }
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
        http.Error(w, "invalid request body", http.StatusBadRequest)
        return
    }

    if body.DisplayName != nil {
        u.DisplayName = *body.DisplayName
    }
    if body.Avatar != nil {
        u.AvatarURL = *body.Avatar
    }

    if err := h.users.Update(u); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    resp := map[string]any{
        "id":            u.ID,
        "username":      u.DisplayName,
        "displayName":   u.DisplayName,
        "email":         u.Email,
        "avatar":        u.AvatarURL,
        "followingCount": 0,
        "followersCount": 0,
        "likesCount":     0,
        "hasBio":         false,
        "createdAt":      u.CreatedAt,
    }

    w.Header().Set("Content-Type", "application/json")
    _ = json.NewEncoder(w).Encode(resp)
}
