package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.35

import (
	"context"

	"github.com/dave-andrew/gqlgen-todos/graph/model"
	"github.com/dave-andrew/gqlgen-todos/middleware"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

// CreateChat is the resolver for the createChat field.
func (r *mutationResolver) CreateChat(ctx context.Context, user1id string) (*model.Chat, error) {
	// panic(fmt.Errorf("not implemented: CreateChat - createChat"))

	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))
	claims, _ := jwtToken.Claims.(jwt.MapClaims)
	userid, _ := claims["user_id"].(string)

	chat := &model.Chat{
		ID:         uuid.NewString(),
		UserID:     userid,
		ReceiverID: user1id,
	}

	if err := r.Db.Create(&chat).Preload("User").Preload("Receiver").First(&chat).Error; err != nil {
		return nil, err
	}

	return chat, nil
}

// CreateGroupChat is the resolver for the createGroupChat field.
func (r *mutationResolver) CreateGroupChat(ctx context.Context, groupid string, users []string) (*model.GroupChat, error) {
	// panic(fmt.Errorf("not implemented: CreateGroupChat - createGroupChat"))

	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))
	claims, _ := jwtToken.Claims.(jwt.MapClaims)
	userid, _ := claims["user_id"].(string)

	users = append(users, userid)

	var user []*model.User

	if err := r.Db.Where("id IN (?)", users).Find(&user).Error; err != nil {
		return nil, err
	}

	groupChat := &model.GroupChat{
		ID:      uuid.NewString(),
		GroupID: groupid,
		Users:   user,
	}

	if err := r.Db.Create(&groupChat).Preload("Group").Preload("Users").First(&groupChat).Error; err != nil {
		return nil, err
	}

	return groupChat, nil
}

// AddGroupUser is the resolver for the addGroupUser field.
func (r *mutationResolver) AddGroupUser(ctx context.Context, groupid string, user string) (*model.GroupChat, error) {
	// panic(fmt.Errorf("not implemented: AddGroupUser - addGroupUser"))

	var groupChat *model.GroupChat

	if err := r.Db.Where("group_id = ?", groupid).Preload("Group").Preload("Users").First(&groupChat).Error; err != nil {
		return nil, err
	}

	var users *model.User

	if err := r.Db.Where("id = ?", user).Find(&users).Error; err != nil {
		return nil, err
	}

	groupChat.Users = append(groupChat.Users, users)

	if err := r.Db.Save(&groupChat).Preload("Group").Preload("Users").First(&groupChat).Error; err != nil {
		return nil, err
	}

	return groupChat, nil
}

// GetChat is the resolver for the getChat field.
func (r *queryResolver) GetChat(ctx context.Context, id string) (*model.Chat, error) {
	// panic(fmt.Errorf("not implemented: GetChat - getChat"))

	var chat *model.Chat

	if err := r.Db.Where("id = ?", id).Preload("User").Preload("Receiver").First(&chat).Error; err != nil {
		return nil, err
	}

	return chat, nil
}

// GetUserChat is the resolver for the getUserChat field.
func (r *queryResolver) GetUserChat(ctx context.Context) ([]*model.Chat, error) {
	// panic(fmt.Errorf("not implemented: GetUserChat - getUserChat"))

	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))
	claims, _ := jwtToken.Claims.(jwt.MapClaims)
	userid, _ := claims["user_id"].(string)

	var chats []*model.Chat

	if err := r.Db.Where("(user_id = ? OR receiver_id = ?)", userid, userid).Preload("User").Preload("Receiver").Find(&chats).Error; err != nil {
		return nil, err
	}

	return chats, nil
}

// CheckChat is the resolver for the checkChat field.
func (r *queryResolver) CheckChat(ctx context.Context, user1d string) (*model.Chat, error) {
	// panic(fmt.Errorf("not implemented: CheckChat - checkChat"))

	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))
	claims, _ := jwtToken.Claims.(jwt.MapClaims)
	userid, _ := claims["user_id"].(string)

	var chat *model.Chat

	if err := r.Db.Where("(user_id = ? AND receiver_id = ?) OR (user_id = ? AND receiver_id = ?)", userid, user1d, user1d, userid).Preload("User").Preload("Receiver").First(&chat).Error; err != nil {
		return nil, err
	}

	return chat, nil
}

// GetUserGroupChat is the resolver for the getUserGroupChat field.
func (r *queryResolver) GetUserGroupChat(ctx context.Context) ([]*model.GroupChat, error) {
	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))
	claims, _ := jwtToken.Claims.(jwt.MapClaims)
	userID, _ := claims["user_id"].(string)

	var groupChats []*model.GroupChat

	err := r.Db.
		Preload("Group").
		Preload("Users").
		Joins("JOIN group_chat_users ON group_chats.id = group_chat_users.group_chat_id").
		Where("group_chat_users.user_id = ?", userID).
		Find(&groupChats).
		Error

	if err != nil {
		return nil, err
	}

	return groupChats, nil
}

// IsUserInGroupChat is the resolver for the isUserInGroupChat field.
func (r *queryResolver) IsUserInGroupChat(ctx context.Context, chatid string) (*model.GroupChat, error) {
	// panic(fmt.Errorf("not implemented: IsUserInGroupChat - isUserInGroupChat"))

	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))
	claims, _ := jwtToken.Claims.(jwt.MapClaims)
	userid, _ := claims["user_id"].(string)

	var groupChat *model.GroupChat

	if err := r.Db.Preload("Group").Preload("Users").
		Joins("JOIN group_chat_users ON group_chats.id = group_chat_users.group_chat_id").
		Where("group_chat_users.user_id = ? AND group_chats.id = ?", userid, chatid).
		First(&groupChat).
		Error; err != nil {
		return nil, err
	}

	return groupChat, nil
}

// GetGroupChat is the resolver for the getGroupChat field.
func (r *queryResolver) GetGroupChat(ctx context.Context, groupid string) (*model.GroupChat, error) {
	// panic(fmt.Errorf("not implemented: GetGroupChat - getGroupChat"))

	var groupChat *model.GroupChat

	if err := r.Db.Preload("Group").Preload("Users").Where("group_id = ?", groupid).First(&groupChat).Error; err != nil {
		return nil, err
	}

	return groupChat, nil
}