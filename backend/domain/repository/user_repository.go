package repository

import "go-qr-app/domain/model"

type UserRepository interface {
	Create(user *model.User) error
	FindByID(id string) (*model.User, error)
	FindByEmail(email string) (*model.User, error)
	ExistsByEmail(email string) (bool, error)
	Update(user *model.User) error
	Delete(id string) error
}