package model

type Chat struct {
	ID         string `json:"ID"`
	UserID     string `json:"UserID"`
	User       *User  `json:"User"`
	ReceiverID string `json:"ReceiverID" gorm:"foreignKey:UserID,references:ID"`
	Receiver   *User  `json:"Receiver"`
}

type GroupChat struct {
	ID      string  `json:"ID"`
	GroupID string  `json:"GroupID" gorm:"unique"`
	Group   *Group  `json:"Group"`
	Users   []*User `json:"Users" gorm:"many2many:group_chat_users;"`
}
