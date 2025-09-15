package usecase

import (
	"time"

	"go-qr-app/domain/model"
	"go-qr-app/domain/repository"
	"go-qr-app/domain/service"
)

type AuthUsecase struct {
	users  repository.UserRepository
	creds  repository.CredentialRepository
	hasher service.PasswordHasher
	jwt    service.JWTIssuer
}

func NewAuthUsecase(
	users repository.UserRepository,
	creds repository.CredentialRepository,
	hasher service.PasswordHasher,
	jwt service.JWTIssuer,
) *AuthUsecase {
	return &AuthUsecase{users: users, creds: creds, hasher: hasher, jwt: jwt}
}

// Register: ユーザー作成 + パスワードハッシュ保存（トークンは返さない最小構成）
func (u *AuthUsecase) Register(displayName, email, password string) (*model.User, error) {
	now := time.Now().UTC()

	user := &model.User{
		DisplayName: displayName,
		Email:       email,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	user.Normalize()
	if err := user.Validate(); err != nil {
		return nil, err
	}

	if user.Email != "" {
		exists, err := u.users.ExistsByEmail(user.Email)
		if err != nil {
			return nil, err
		}
		if exists {
			return nil, model.ErrEmailAlreadyUsed
		}
	}

	if err := u.users.Create(user); err != nil {
		return nil, err
	}

	hash, err := u.hasher.Hash(password)
	if err != nil {
		return nil, err
	}

	cred := &model.Credential{
		UserID:       user.ID,
		PasswordHash: hash,
		CreatedAt:    now,
		UpdatedAt:    now,
	}
	if err := u.creds.Create(cred); err != nil {
		return nil, err
	}

	return user, nil
}

// Login: 認証に成功したらJWTを発行
func (u *AuthUsecase) Login(email, password string) (token string, expiresAt time.Time, err error) {
	// Emailの軽整形（lower/trim は User.Normalize に準拠）
	lookup := &model.User{Email: email}
	lookup.Normalize()

	user, err := u.users.FindByEmail(lookup.Email)
	if err != nil {
		return "", time.Time{}, err
	}
	if user == nil {
		return "", time.Time{}, model.ErrInvalidCredentials
	}

	cred, err := u.creds.FindByUserID(user.ID)
	if err != nil {
		return "", time.Time{}, err
	}
	if cred == nil || !u.hasher.Compare(cred.PasswordHash, password) {
		return "", time.Time{}, model.ErrInvalidCredentials
	}

	//JWTを発行してる
	return u.jwt.Issue(user.ID, 24*time.Hour, nil)
}

// Logout: JWT無状態運用では何もしない（クライアントでトークン破棄）
func (u *AuthUsecase) Logout(_ string) error {
	return nil
}
