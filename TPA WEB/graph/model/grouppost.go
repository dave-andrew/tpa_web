package model

import "time"

type GroupPost struct {
	ID          string    `json:"ID"`
	Description string    `json:"Description"`
	Likes       int       `json:"Likes"`
	Shares      int       `json:"Shares"`
	ImageURL    []string  `json:"ImageURL" gorm:"json"`
	UserID      string    `json:"UserID"`
	User        *User     `json:"User"`
	CreatedAt   time.Time `json:"createdAt"`
	Visibility  string    `json:"Visibility"`
	GroupID     string    `json:"GroupID"`
	Group       *Group    `json:"Group" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type GroupLike struct {
	UserID      string     `json:"UserID" gorm:"primaryKey;foreignKey:UserID,references:ID"`
	User        *User      `json:"User"`
	GroupPostID string     `json:"GroupPostID" gorm:"primaryKey;foreignKey:GroupPostID,references:ID;"`
	GroupPost   *GroupPost `json:"GroupPost" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt   time.Time  `json:"CreatedAt"`
}

type GroupComment struct {
	ID             string     `json:"ID"`
	GroupPostID    string     `json:"GroupPostID"`
	GroupPost      *GroupPost `json:"GroupPost" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	GroupCommentID *string    `json:"GroupCommentID,omitempty"`
	UserID         string     `json:"UserID"`
	User           *User      `json:"User"`
	Message        string     `json:"Message"`
	CreatedAt      time.Time  `json:"createdAt"`
}
