package model

import "time"

type Post struct {
	ID          string    `json:"ID"`
	Description string    `json:"Description"`
	Likes       int       `json:"Likes"`
	Shares      int       `json:"Shares"`
	ImageURL    []string  `json:"ImageURL" gorm:"json"`
	UserID      string    `json:"UserID"`
	User        *User     `json:"User"`
	CreatedAt   time.Time `json:"createdAt"`
	Visibility  string    `json:"Visibility"`
}

type Comment struct {
	ID        string    `json:"ID"`
	PostID    string    `json:"PostID"`
	Post      *Post     `json:"Post" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	CommentID *string   `json:"CommentID"`
	UserID    string    `json:"UserID"`
	User      *User     `json:"User"`
	Message   string    `json:"Message"`
	CreatedAt time.Time `json:"createdAt"`
}

type Like struct {
	UserID    string    `json:"UserID" gorm:"primaryKey;foreignKey:UserID,references:ID"`
	User      *User     `json:"User"`
	PostID    string    `json:"PostID" gorm:"primaryKey;foreignKey:PostID,references:ID"`
	Post      *Post     `json:"Post" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	CreatedAt time.Time `json:"CreatedAt"`
}
