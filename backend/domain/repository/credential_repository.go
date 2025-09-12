package repository

import "go-qr-app/domain/model"

type CredentialRepository interface {
	Create(credential *model.Credential) error
	FindByUserID(userID string) (*model.Credential, error)
	Update(credential *model.Credential) error
	Delete(userID string) error
}