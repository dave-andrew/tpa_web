package model

import "time"

type User struct {
	ID             string    `json:"ID"`
	Name           string    `json:"Name"`
	Surname        string    `json:"Surname"`
	Email          string    `json:"Email"`
	Dob            time.Time `json:"DOB"`
	Gender         string    `json:"Gender"`
	Password       string    `json:"Password"`
	Approved       bool      `json:"Approved"`
	ProfilePicture string    `json:"ProfilePicture"`
	HomePicture    string    `json:"HomePicture"`
}
