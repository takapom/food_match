package infrastructure

import (
	"go-qr-app/domain/model"
	"log"
	"time"

	"gorm.io/gorm"
)

// DBのオブジェクトを受け取る→DB用の構造が欲しいから
type UserRepository struct {
	DB *gorm.DB
}

// UserRepository構造体のインスタンスを作成する→DB用の構造の型作り
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

// ユーザーを挿入する前に重複をチェックするメソッド
func (r *UserRepository) InsertUserIfNotExists(user *model.User) error {
	// ユーザー名が既に存在するかチェック
	var existingUser model.User
	result := r.DB.Where("display_name = ?", user.DisplayName).First(&existingUser)
	if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
		log.Printf("Failed to check existing user: %v", result.Error)
		return result.Error
	}

	// 既存ユーザーが存在する場合はスキップ
	if result.RowsAffected > 0 {
		log.Printf("User with display name '%s' already exists. Skipping insertion.", user.DisplayName)
		return nil
	}

	// ユーザーを挿入
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	if err := r.DB.Create(user).Error; err != nil {
		log.Printf("Failed to insert user: %v", err)
		return err
	}

	log.Printf("User '%s' inserted successfully.", user.DisplayName)
	return nil
}

// Create inserts a new user record
func (r *UserRepository) Create(user *model.User) error {
	if user.CreatedAt.IsZero() {
		user.CreatedAt = time.Now().UTC()
	}
	user.UpdatedAt = time.Now().UTC()
	if err := r.DB.Create(user).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) FindByID(id string) (*model.User, error) {
	var u model.User
	if err := r.DB.Where("id = ?", id).First(&u).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) FindByEmail(email string) (*model.User, error) {
	var u model.User
	if err := r.DB.Where("email = ?", email).First(&u).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) ExistsByEmail(email string) (bool, error) {
	var count int64
	if err := r.DB.Model(&model.User{}).Where("email = ?", email).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *UserRepository) Update(user *model.User) error {
	user.Touch()
	if err := r.DB.Save(user).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) Delete(id string) error {
	if err := r.DB.Where("id = ?", id).Delete(&model.User{}).Error; err != nil {
		return err
	}
	return nil
}
