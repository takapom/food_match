package infrastructure

import (
	"go-qr-app/domain/model"
	"log"
	"time"

	"gorm.io/gorm"
)

// CredentialRepositoryImpl implements domain repository using GORM
type CredentialRepositoryImpl struct {
	DB *gorm.DB
}

func NewCredentialRepository(db *gorm.DB) *CredentialRepositoryImpl {
	return &CredentialRepositoryImpl{DB: db}
}

func (r *CredentialRepositoryImpl) Create(credential *model.Credential) error {
	credential.CreatedAt = time.Now()
	credential.UpdatedAt = time.Now()
	if err := r.DB.Create(credential).Error; err != nil {
		log.Printf("Failed to create credential: %v", err)
		return err
	}
	return nil
}

func (r *CredentialRepositoryImpl) FindByUserID(userID string) (*model.Credential, error) {
	var cred model.Credential
	if err := r.DB.Where("user_id = ?", userID).First(&cred).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &cred, nil
}

func (r *CredentialRepositoryImpl) Update(credential *model.Credential) error {
	credential.Touch()
	if err := r.DB.Save(credential).Error; err != nil {
		return err
	}
	return nil
}

func (r *CredentialRepositoryImpl) Delete(userID string) error {
	if err := r.DB.Where("user_id = ?", userID).Delete(&model.Credential{}).Error; err != nil {
		return err
	}
	return nil
}
