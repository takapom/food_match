package model

import "errors"

var (
    ErrEmailAlreadyUsed   = errors.New("email already used")
    ErrInvalidCredentials = errors.New("invalid credentials")
    ErrUserNotFound       = errors.New("user not found")
    ErrUnauthorized       = errors.New("unauthorized")
)
