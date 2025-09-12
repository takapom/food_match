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
