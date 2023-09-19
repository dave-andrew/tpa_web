package model

import "time"

type Notification struct {
	ID        string    `json:"ID"`
	UserID    string    `json:"UserID"`
	User      *User     `json:"User,omitempty"`
	SenderID  string    `json:"SenderID" gorm:"foreignKey:UserID,references:ID"`
	Sender    *User     `json:"Sender,omitempty"`
	Message   string    `json:"Message"`
	Status    bool      `json:"Status"`
	CreatedAt time.Time `json:"CreatedAt"`
}

type BlockNotification struct {
	ID        string `json:"ID"`
	UserID    string `json:"UserID"`
	User      *User  `json:"User,omitempty"`
	BlockedID string `json:"BlockedID" gorm:"foreignKey:UserID,references:ID"`
	Blocked   *User  `json:"Blocked,omitempty"`
}
