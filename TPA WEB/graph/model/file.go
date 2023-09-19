package model

import "time"

type File struct {
	ID        string    `json:"ID"`
	Name      string    `json:"Name"`
	Path      string    `json:"Path"`
	Type      string    `json:"Type"`
	UserID    string    `json:"UserID"`
	User      *User     `json:"User"`
	GroupID   string    `json:"GroupID"`
	Group     *Group    `json:"Group" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt time.Time `json:"CreatedAt"`
}
