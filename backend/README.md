⏺ 🏗️ バックエンド実装内容の詳細提案

  📁 domain/model/restaurant.go

  package model

  import "time"

  type Restaurant struct {
      ID           string    `json:"id"`
      Name         string    `json:"name"`
      NameKana     string    `json:"name_kana"`
      Address      string    `json:"address"`
      Lat          float64   `json:"lat"`
      Lng          float64   `json:"lng"`
      Genre        Genre     `json:"genre"`
      Budget       Budget    `json:"budget"`
      Photo        Photo     `json:"photo"`
      Catch        string    `json:"catch"`
      Open         string    `json:"open"`
      Close        string    `json:"close"`
      Access       string    `json:"access"`
      URL          string    `json:"urls"`
      CreatedAt    time.Time `json:"created_at"`
  }

  type Genre struct {
      Code  string `json:"code"`
      Name  string `json:"name"`
      Catch string `json:"catch"`
  }

  type Budget struct {
      Code    string `json:"code"`
      Name    string `json:"name"`
      Average string `json:"average"`
  }



  📁 domain/model/like.go

  package model

  import "time"

  type Like struct {
      ID           string    `json:"id"`
      UserID       string    `json:"user_id"`
      RestaurantID string    `json:"restaurant_id"`
      CreatedAt    time.Time `json:"created_at"`
  }

  📁 domain/repository/restaurant_repository.go

  package repository

  import "food-matching/domain/model"

  type RestaurantRepository interface {
      Search(area, genre string, limit, offset int) ([]*model.Restaurant, error)
      FindByID(id string) (*model.Restaurant, error)
      Save(restaurant *model.Restaurant) error
  }

  type LikeRepository interface {
      Create(like *model.Like) error
      Delete(userID, restaurantID string) error
      FindByUserID(userID string) ([]*model.Like, error)
      Exists(userID, restaurantID string) (bool, error)
  }

  📁 usecase/restaurant_usecase.go

  package usecase

  import (
      "food-matching/domain/model"
      "food-matching/infrastructure/external"
  )

  type RestaurantUseCase struct {
      hotpepperClient *external.HotpepperClient
  }

  func NewRestaurantUseCase(client *external.HotpepperClient) *RestaurantUseCase {
      return &RestaurantUseCase{
          hotpepperClient: client,
      }
  }

  func (u *RestaurantUseCase) SearchRestaurants(area, genre string, count, start int) ([]*model.Restaurant,
   error) {
      // ホットペッパーAPIから取得
      return u.hotpepperClient.Search(area, genre, count, start)
  }

  📁 usecase/like_usecase.go

  package usecase

  import (
      "food-matching/domain/model"
      "food-matching/domain/repository"
      "github.com/google/uuid"
      "time"
  )

  type LikeUseCase struct {
      likeRepo repository.LikeRepository
  }

  func NewLikeUseCase(repo repository.LikeRepository) *LikeUseCase {
      return &LikeUseCase{likeRepo: repo}
  }

  func (u *LikeUseCase) CreateLike(userID, restaurantID string) error {
      // 既存チェック
      exists, err := u.likeRepo.Exists(userID, restaurantID)
      if err != nil {
          return err
      }
      if exists {
          return nil // 既にいいね済み
      }

      like := &model.Like{
          ID:           uuid.New().String(),
          UserID:       userID,
          RestaurantID: restaurantID,
          CreatedAt:    time.Now(),
      }

      return u.likeRepo.Create(like)
  }

  📁 infrastructure/external/hotpepper_client.go

  package external

  import (
      "encoding/json"
      "fmt"
      "food-matching/domain/model"
      "net/http"
      "net/url"
  )

  type HotpepperClient struct {
      apiKey  string
      baseURL string
  }

  type HotpepperResponse struct {
      Results struct {
          Shop []HotpepperShop `json:"shop"`
      } `json:"results"`
  }

  type HotpepperShop struct {
      ID     string `json:"id"`
      Name   string `json:"name"`
      // ... 他のフィールド
  }

  func NewHotpepperClient(apiKey string) *HotpepperClient {
      return &HotpepperClient{
          apiKey:  apiKey,
          baseURL: "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/",
      }
  }

  func (c *HotpepperClient) Search(area, genre string, count, start int) ([]*model.Restaurant, error) {
      params := url.Values{}
      params.Add("key", c.apiKey)
      params.Add("format", "json")
      params.Add("count", fmt.Sprintf("%d", count))
      params.Add("start", fmt.Sprintf("%d", start))

      if area != "" {
          params.Add("large_area", area)
      }
      if genre != "" {
          params.Add("genre", genre)
      }

      resp, err := http.Get(c.baseURL + "?" + params.Encode())
      if err != nil {
          return nil, err
      }
      defer resp.Body.Close()

      var data HotpepperResponse
      if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
          return nil, err
      }

      // HotpepperShop → model.Restaurant に変換
      restaurants := make([]*model.Restaurant, 0, len(data.Results.Shop))
      for _, shop := range data.Results.Shop {
          restaurants = append(restaurants, c.toRestaurant(shop))
      }

      return restaurants, nil
  }

  func (c *HotpepperClient) toRestaurant(shop HotpepperShop) *model.Restaurant {
      // 変換ロジック
      return &model.Restaurant{
          ID:   shop.ID,
          Name: shop.Name,
          // ... 他のフィールドをマッピング
      }
  }

  📁 infrastructure/persistence/like_repository.go

  package persistence

  import (
      "food-matching/domain/model"
      "food-matching/domain/repository"
      "sync"
  )

  // 初期実装はメモリ保存（後でDB実装に変更可能）
  type inMemoryLikeRepository struct {
      mu    sync.RWMutex
      likes map[string][]*model.Like // userID -> likes
  }

  func NewLikeRepository() repository.LikeRepository {
      return &inMemoryLikeRepository{
          likes: make(map[string][]*model.Like),
      }
  }

  func (r *inMemoryLikeRepository) Create(like *model.Like) error {
      r.mu.Lock()
      defer r.mu.Unlock()

      r.likes[like.UserID] = append(r.likes[like.UserID], like)
      return nil
  }

  func (r *inMemoryLikeRepository) Exists(userID, restaurantID string) (bool, error) {
      r.mu.RLock()
      defer r.mu.RUnlock()

      likes := r.likes[userID]
      for _, like := range likes {
          if like.RestaurantID == restaurantID {
              return true, nil
          }
      }
      return false, nil
  }

  // 他のメソッドも実装...

  📁 handler/restaurant_handler.go

  package handler

  import (
      "food-matching/usecase"
      "net/http"
      "strconv"

      "github.com/labstack/echo/v4"
  )

  type RestaurantHandler struct {
      restaurantUseCase *usecase.RestaurantUseCase
  }

  func NewRestaurantHandler(uc *usecase.RestaurantUseCase) *RestaurantHandler {
      return &RestaurantHandler{restaurantUseCase: uc}
  }

  func (h *RestaurantHandler) Search(c echo.Context) error {
      area := c.QueryParam("area")
      genre := c.QueryParam("genre")
      count, _ := strconv.Atoi(c.QueryParam("count"))
      if count == 0 {
          count = 10
      }
      start, _ := strconv.Atoi(c.QueryParam("start"))
      if start == 0 {
          start = 1
      }

      restaurants, err := h.restaurantUseCase.SearchRestaurants(area, genre, count, start)
      if err != nil {
          return c.JSON(http.StatusInternalServerError, map[string]string{
              "error": err.Error(),
          })
      }

      return c.JSON(http.StatusOK, restaurants)
  }

  📁 router/router.go

  package router

  import (
      "food-matching/handler"

      "github.com/labstack/echo/v4"
      "github.com/labstack/echo/v4/middleware"
  )

  func NewRouter(
      restaurantHandler *handler.RestaurantHandler,
      likeHandler *handler.LikeHandler,
      healthHandler *handler.HealthHandler,
  ) *echo.Echo {
      e := echo.New()

      // ミドルウェア
      e.Use(middleware.Logger())
      e.Use(middleware.Recover())
      e.Use(middleware.CORS())

      // ルーティング
      e.GET("/health", healthHandler.Check)

      api := e.Group("/api")
      api.GET("/restaurants", restaurantHandler.Search)
      api.POST("/likes", likeHandler.Create)
      api.DELETE("/likes/:restaurantId", likeHandler.Delete)

      return e
  }

  📁 cmd/main.go

  package main

  import (
      "food-matching/config"
      "food-matching/handler"
      "food-matching/infrastructure/external"
      "food-matching/infrastructure/persistence"
      "food-matching/router"
      "food-matching/usecase"
      "log"
  )

  func main() {
      // 設定読み込み
      cfg := config.Load()

      // 依存性の注入（DI）
      // External
      hotpepperClient := external.NewHotpepperClient(cfg.HotpepperAPIKey)

      // Repository
      likeRepo := persistence.NewLikeRepository()

      // UseCase
      restaurantUC := usecase.NewRestaurantUseCase(hotpepperClient)
      likeUC := usecase.NewLikeUseCase(likeRepo)

      // Handler
      restaurantHandler := handler.NewRestaurantHandler(restaurantUC)
      likeHandler := handler.NewLikeHandler(likeUC)
      healthHandler := handler.NewHealthHandler()

      // Router
      r := router.NewRouter(restaurantHandler, likeHandler, healthHandler)

      // サーバー起動
      log.Printf("Server starting on port %s", cfg.Port)
      if err := r.Start(":" + cfg.Port); err != nil {
          log.Fatal(err)
      }
  }

  📁 config/config.go

  package config

  import (
      "os"

      "github.com/joho/godotenv"
  )

  type Config struct {
      Port            string
      HotpepperAPIKey string
      DatabaseURL     string
  }

  func Load() *Config {
      godotenv.Load()

      return &Config{
          Port:            getEnv("PORT", "8080"),
          HotpepperAPIKey: getEnv("HOTPEPPER_API_KEY", ""),
          DatabaseURL:     getEnv("DATABASE_URL", ""),
      }
  }

  func getEnv(key, defaultValue string) string {
      if value := os.Getenv(key); value != "" {
          return value
      }
      return defaultValue
  }

  📁 .env.example

  PORT=8080
  HOTPEPPER_API_KEY=your_api_key_here
  DATABASE_URL=postgresql://user:pass@localhost:5432/food_matching

  🚀 実装の順番

  1. 基本セットアップ → config, main.go
  2. ドメインモデル → domain/model
  3. 外部API連携 → infrastructure/external
  4. ユースケース → usecase
  5. HTTPハンドラー → handler
  6. ルーティング → router
  7. メモリ実装 → infrastructure/persistence（まずメモリ版）
  8. DB実装 → 後でPostgreSQL版に差し替え

  この構造なら、段階的に実装でき、クリーンアーキテクチャの原則も学べます。