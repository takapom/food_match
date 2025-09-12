package model

import "time"

type Bookmark struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	LogoImage string    `json:"logo_image"`
	NameKana  string    `json:"name_kana"`
	Address   string    `json:"address"`
	CreatedAt time.Time `json:"created_at"`
}
