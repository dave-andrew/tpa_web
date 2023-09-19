package model

import "time"

type Story struct {
	ID        string    `json:"ID"`
	UserID    string    `json:"UserID"`
	User      *User     `json:"User"`
	StoryURL  *string   `json:"StoryURL,omitempty"`
	Font      *string   `json:"Font,omitempty"`
	Color     *string   `json:"Color,omitempty"`
	Text      *string   `json:"Text,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}
