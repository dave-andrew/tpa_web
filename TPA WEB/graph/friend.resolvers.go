package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.35

import (
	"context"

	"github.com/dave-andrew/gqlgen-todos/graph/model"
	"github.com/dave-andrew/gqlgen-todos/middleware"
	"github.com/golang-jwt/jwt"
)

// AddFriend is the resolver for the addFriend field.
func (r *mutationResolver) AddFriend(ctx context.Context, friendid string) (*model.Friend, error) {
	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	//panic(fmt.Errorf("not implemented: AddFriend - addFriend"))
	friend := &model.Friend{
		UserID:   userid,
		FriendID: friendid,
		Status:   false,
	}

	if err := r.Db.Create(friend).Preload("User").Preload("Friend").Find(&friend).Error; err != nil {
		return nil, err
	}

	return friend, nil
}

// AcceptFriend is the resolver for the acceptFriend field.
func (r *mutationResolver) AcceptFriend(ctx context.Context, friendid string) (*model.Friend, error) {
	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var friend *model.Friend
	if err := r.Db.Where("user_id = ? AND friend_id = ?", friendid, userid).Preload("User").Preload("Friend").First(&friend).Error; err != nil {
		return nil, err
	}

	friend.Status = true

	if err := r.Db.Save(&friend).Error; err != nil {
		return nil, err
	}

	return friend, nil
}

// RemoveFriend is the resolver for the removeFriend field.
func (r *mutationResolver) RemoveFriend(ctx context.Context, friendid string) (*model.Friend, error) {
	// panic(fmt.Errorf("not implemented: RemoveFriend - removeFriend"))
	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var friend *model.Friend
	if err := r.Db.Where("(user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", userid, friendid, friendid, userid).First(&friend).Error; err != nil {
		return nil, err
	}

	if err := r.Db.Delete(&friend).Error; err != nil {
		return nil, err
	}

	return friend, nil
}

// GetFriends is the resolver for the getFriends field.
func (r *queryResolver) GetFriends(ctx context.Context) ([]*model.Friend, error) {
	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var friends []*model.Friend

	if err := r.Db.Where("(user_id = ? OR friend_id = ?) AND status = ?", userid, userid, true).
		Preload("User").
		Preload("Friend").
		Find(&friends).
		Error; err != nil {
		return nil, err
	}

	return friends, nil
}

// GetMutual is the resolver for the getMutual field.
func (r *queryResolver) GetMutual(ctx context.Context, friendid string) ([]*model.User, error) {
	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))
	claims, _ := jwtToken.Claims.(jwt.MapClaims)
	userid, _ := claims["user_id"].(string)

	var userFriends []*string

	if err := r.Db.Model(&model.Friend{}).Where("(friend_id = ? OR user_id = ?) AND status = ?", userid, userid, true).Select("CASE WHEN user_id = ? THEN friend_id ELSE user_id END", userid).Find(&userFriends).Error; err != nil {
		return nil, err
	}

	var friendFriends []*string

	if err := r.Db.Model(&model.Friend{}).Where("(friend_id = ? OR user_id = ?) AND status = ?", friendid, friendid, true).Select("CASE WHEN user_id = ? THEN friend_id ELSE user_id END", friendid).Find(&friendFriends).Error; err != nil {
		return nil, err
	}

	var mutual []*string

	for _, userFriend := range userFriends {
		for _, friendFriend := range friendFriends {
			if *userFriend == *friendFriend {
				mutual = append(mutual, userFriend)
			}
		}
	}

	var mutualUser []*model.User

	if err := r.Db.Where("id IN (?)", mutual).Find(&mutualUser).Error; err != nil {
		return nil, err
	}

	return mutualUser, nil
}

// GetStatus is the resolver for the getStatus field.
func (r *queryResolver) GetStatus(ctx context.Context, friendid string) (*model.Friend, error) {
	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var friend *model.Friend

	if err := r.Db.Where("(user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", userid, friendid, friendid, userid).Preload("User").Preload("Friend").First(&friend).Error; err != nil {
		return nil, err
	}

	return friend, nil
}

// GetRequestFriend is the resolver for the getRequestFriend field.
func (r *queryResolver) GetRequestFriend(ctx context.Context) ([]*model.Friend, error) {
	// panic(fmt.Errorf("not implemented: GetRequestFriend - getRequestFriend"))
	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var friend []*model.Friend

	if err := r.Db.Where("friend_id = ? AND status = ?", userid, false).Preload("User").Preload("Friend").Find(&friend).Error; err != nil {
		return nil, err
	}

	return friend, nil
}

// GetRecomFriend is the resolver for the getRecomFriend field.
func (r *queryResolver) GetRecomFriend(ctx context.Context) ([]*model.User, error) {
	// panic(fmt.Errorf("not implemented: GetRecomFriend - getRecomFriend"))

	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var userFriends []*string

	if err := r.Db.Model(&model.Friend{}).Where("(friend_id = ? OR user_id = ?) AND status = ?", userid, userid, true).Select("CASE WHEN user_id = ? THEN friend_id ELSE user_id END", userid).Find(&userFriends).Error; err != nil {
		return nil, err
	}

	var friendRecom []*string

	if err := r.Db.Model(&model.Friend{}).Where("(user_id IN (?) OR friend_id IN (?)) AND (user_id != ? OR friend_id != ?)", userFriends, userFriends, userid, userid).Select("CASE WHEN user_id IN (?) THEN friend_id ELSE user_id END", userFriends).Find(&friendRecom).Error; err != nil {
		return nil, err
	}

	var recom []*string

	if err := r.Db.Model(&model.Friend{}).Where("(friend_id = ? OR user_id = ?)", userid, userid).Select("CASE WHEN user_id = ? THEN friend_id ELSE user_id END", userid).Find(&recom).Error; err != nil {
		return nil, err
	}

	var recomUser []*model.User

	if err := r.Db.Where("id IN (?) AND id NOT IN (?) AND id != ?", friendRecom, recom, userid).Limit(5).Find(&recomUser).Error; err != nil {
		return nil, err
	}

	return recomUser, nil
}

// GetFriendUser is the resolver for the getFriendUser field.
func (r *queryResolver) GetFriendUser(ctx context.Context) ([]*model.User, error) {
	// panic(fmt.Errorf("not implemented: GetFriendUser - getFriendUser"))

	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var userFriends []*string

	if err := r.Db.Model(&model.Friend{}).Where("(friend_id = ? OR user_id = ?) AND status = ?", userid, userid, true).Select("CASE WHEN user_id = ? THEN friend_id ELSE user_id END", userid).Find(&userFriends).Error; err != nil {
		return nil, err
	}

	var friendUser []*model.User

	if err := r.Db.Where("id IN (?)", userFriends).Find(&friendUser).Error; err != nil {
		return nil, err
	}

	return friendUser, nil
}

// CountFriend is the resolver for the countFriend field.
func (r *queryResolver) CountFriend(ctx context.Context) (int, error) {
	// panic(fmt.Errorf("not implemented: CountFriend - countFriend"))

	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var count int64

	if err := r.Db.Model(&model.Friend{}).Where("(friend_id = ? OR user_id = ?) AND status = ?", userid, userid, true).Count(&count).Error; err != nil {
		return 0, err
	}

	return int(count), nil
}

// GetUserFriend is the resolver for the getUserFriend field.
func (r *queryResolver) GetUserFriend(ctx context.Context, userid string) ([]*model.User, error) {
	// panic(fmt.Errorf("not implemented: GetUserFriend - getUserFriend"))

	var userFriends []*string

	if err := r.Db.Model(&model.Friend{}).Where("(friend_id = ? OR user_id = ?) AND status = ?", userid, userid, true).Select("CASE WHEN user_id = ? THEN friend_id ELSE user_id END", userid).Find(&userFriends).Error; err != nil {
		return nil, err
	}

	var friendUser []*model.User

	if err := r.Db.Where("id IN (?)", userFriends).Find(&friendUser).Error; err != nil {
		return nil, err
	}

	return friendUser, nil
}
