package model

import "time"

type Reel struct {
	ID        string    `json:"ID"`
	URL       string    `json:"Url"`
	UserID    string    `json:"UserID"`
	User      *User     `json:"User"`
	CreatedAt time.Time `json:"CreatedAt"`
	ReelLike  int       `json:"ReelLike"`
	Share     int       `json:"Share"`
}

type ReelComment struct {
	ID        string    `json:"ID"`
	ReelID    string    `json:"ReelID"`
	Reel      *Reel     `json:"Reel" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	CommentID *string   `json:"CommentID,omitempty"`
	UserID    string    `json:"UserID"`
	User      *User     `json:"User"`
	Message   string    `json:"Message"`
	CreatedAt time.Time `json:"createdAt"`
}

type ReelLike struct {
	UserID    string    `json:"UserID" gorm:"primaryKey;foreignKey:UserID,references:ID"`
	User      *User     `json:"User"`
	ReelID    string    `json:"ReelID" gorm:"primaryKey;foreignKey:ReelID,references:ID"`
	Reel      *Reel     `json:"Reel"`
	CreatedAt time.Time `json:"CreatedAt"`
}
