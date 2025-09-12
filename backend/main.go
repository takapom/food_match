package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	"go-qr-app/domain/model"
	"go-qr-app/handler"
	"go-qr-app/handler/middleware"
	infra "go-qr-app/infrastructure"
	"go-qr-app/infrastructure/jwt"
	"go-qr-app/usecase"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// .env ファイルが存在する場合のみ読み込む（コンテナ環境では環境変数を使用）
	if _, statErr := os.Stat(".env"); statErr == nil {
		if err := godotenv.Load(".env"); err != nil {
			log.Printf("ERROR: failed to load .env: %v", err)
		} else {
			log.Println(".env loaded")
		}
	}

	// 環境変数から DSN を構築
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	log.Println("DSN:", dsn)
	// データベース接続処理をここに記述

	// GORM を使ってデータベースに接続
	gormDB, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// マイグレーション対象のモデルを登録
	models := []interface{}{
		&model.User{},
		&model.Credential{},
	}

	// マイグレーションの実行
	for _, m := range models {
		if err := gormDB.AutoMigrate(m); err != nil {
			log.Fatalf("Failed to migrate model %T: %v", m, err)
		}
	}

	// JWT秘密鍵の設定
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key-change-this-in-production"
		log.Println("WARNING: Using default JWT secret. Set JWT_SECRET environment variable in production!")
	}

	// Repositories and services
	userRepo := infra.NewUserRepository(gormDB)
	credRepo := infra.NewCredentialRepository(gormDB)

	// Password hasher (bcrypt)
	hasher := infra.NewBcryptHasher(12)

	// JWT Issuer
	jwtIssuer := jwt.NewJWTIssuer(jwtSecret, "food-matching-app", []string{"food-matching-app"})

	// Auth usecase wiring
	authUC := usecase.NewAuthUsecase(userRepo, credRepo, hasher, jwtIssuer)

	log.Println("Database migration completed successfully.")

	// ハンドラーの初期化
	//こいつはJWTを生成するためもobject
	authHandler := handler.NewAuthHandler(jwtIssuer, authUC)
	//こいつはJWTを認証するためのobject
	authMiddleware := middleware.NewAuthMiddleware(jwtIssuer)

	// ルーティング設定→Listenした後にこれが発火してユーザーからのリクエストを割り振ることができる
	mux := http.NewServeMux()

	// ログインエンドポイント（認証不要）
	mux.HandleFunc("/api/login", authHandler.Login)

	mux.HandleFunc("/api/register", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			DisplayName string `json:"display_name"`
			Email       string `json:"email"`
			Password    string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}

		user, err := authUC.Register(req.DisplayName, req.Email, req.Password)
		if err != nil {
			if err == model.ErrEmailAlreadyUsed {
				http.Error(w, err.Error(), http.StatusConflict)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(map[string]string{
			"id":           user.ID,
			"email":        user.Email,
			"display_name": user.DisplayName,
		})
	})

	// 保護されたエンドポイントの例
	mux.HandleFunc("/api/protected", authMiddleware.Authenticate(func(w http.ResponseWriter, r *http.Request) {
		userID, _ := middleware.GetUserID(r.Context())
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "This is protected endpoint", "user_id": "` + userID + `"}`))
	}))

	// サーバー起動
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Println("Test endpoints:")
	log.Println("  POST /api/login - Login with {\"user_id\":\"test\", \"password\":\"password\"}")
	log.Println("  GET /api/protected - Protected endpoint (requires Bearer token)")
	log.Println("  GET /api/health - Health check")

	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}
