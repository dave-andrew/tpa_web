package model

type Group struct {
	ID         string  `json:"ID"`
	Name       string  `json:"Name"`
	Visibility string  `json:"Visibility"`
	ImageURL   *string `json:"ImageURL,omitempty"`
	Admins     []*User `json:"Admins" gorm:"many2many:group_admins;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Members    []*User `json:"Members" gorm:"many2many:group_members;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type GroupPending struct {
	ID         string `json:"ID"`
	GroupID    string `json:"GroupID" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Group      *Group `json:"Group"`
	SenderID   string `json:"SenderID" gorm:"foreignKey:UserID, references:ID"`
	Sender     *User  `json:"Sender"`
	ReceiverID string `json:"ReceiverID" gorm:"foreignKey:UserID, references:ID"`
	Receiver   *User  `json:"Receiver"`
}

type GroupRequest struct {
	GroupID string `json:"GroupID" gorm:"primaryKey;foreignKey:GroupID, references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Group   *Group `json:"Group"`
	UserID  string `json:"UserID" gorm:"primaryKey;foreignKey:UserID, references:ID"`
	User    *User  `json:"User"`
}
