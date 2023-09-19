package model

type Friend struct {
	UserID   string `json:"UserID" gorm:"primaryKey;foreignKey:UserID,references:ID"`
	User     *User  `json:"User"`
	FriendID string `json:"FriendID" gorm:"primaryKey;foreignKey:UserID,references:ID"`
	Friend   *User  `json:"Friend"`
	Status   bool   `json:"Status"`
}
