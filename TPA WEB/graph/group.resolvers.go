package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.35

import (
	"context"
	"fmt"

	"github.com/dave-andrew/gqlgen-todos/graph/model"
	"github.com/dave-andrew/gqlgen-todos/middleware"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

// CreateGroup is the resolver for the createGroup field.
func (r *mutationResolver) CreateGroup(ctx context.Context, name string, visibility string, members []*string) (*model.Group, error) {
	// panic(fmt.Errorf("not implemented: CreateGroup - createGroup"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	group := &model.Group{
		ID:         uuid.NewString(),
		Name:       name,
		Visibility: visibility,
		ImageURL:   nil,
	}

	group.Admins = append(group.Admins, &model.User{ID: userid})

	for _, member := range members {
		group.Members = append(group.Members, &model.User{ID: *member})
	}

	if err := r.Db.Create(group).Preload("Admins").Preload("Members").Find(group).Error; err != nil {
		return nil, err
	}

	return group, nil
}

// UpdateGroup is the resolver for the updateGroup field.
func (r *mutationResolver) UpdateGroup(ctx context.Context, id string, name string, visibility string) (*model.Group, error) {
	panic(fmt.Errorf("not implemented: UpdateGroup - updateGroup"))
}

// UpdateGroupImage is the resolver for the updateGroupImage field.
func (r *mutationResolver) UpdateGroupImage(ctx context.Context, id string, image string) (*model.Group, error) {
	// panic(fmt.Errorf("not implemented: UpdateGroupImage - updateGroupImage"))

	var group *model.Group

	if err := r.Db.Where("id = ?", id).First(&group).Error; err != nil {
		return nil, err
	}

	group.ImageURL = &image

	if err := r.Db.Save(&group).Error; err != nil {
		return nil, err
	}

	return group, nil
}

// LeaveGroupMember is the resolver for the leaveGroupMember field.
func (r *mutationResolver) LeaveGroupMember(ctx context.Context, id string) (string, error) {
	// panic(fmt.Errorf("not implemented: LeaveGroupMember - leaveGroupMember"))
	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))
	claims, _ := jwtToken.Claims.(jwt.MapClaims)
	userid, _ := claims["user_id"].(string)

	var user *model.User

	if err := r.Db.Where("id = ?", userid).First(&user).Error; err != nil {
		return "", err
	}

	fmt.Println("User ID: " + user.ID)

	var group *model.Group

	if err := r.Db.Where("id = ?", id).Preload("Admins").Preload("Members").First(&group).Error; err != nil {
		return "", err
	}

	fmt.Println(group.Admins)
	fmt.Println(group.Members)

	r.Db.Model(&group).Association("Members").Delete([]*model.User{user})

	return "Group Leaved!", nil
}

// LeaveGroupAdmin is the resolver for the leaveGroupAdmin field.
func (r *mutationResolver) LeaveGroupAdmin(ctx context.Context, id string) (string, error) {
	// panic(fmt.Errorf("not implemented: LeaveGroupAdmin - leaveGroupAdmin"))

	token := ctx.Value("TokenValue")
	jwtToken, _ := middleware.ValidateJWTToken(token.(string))
	claims, _ := jwtToken.Claims.(jwt.MapClaims)
	userid, _ := claims["user_id"].(string)

	var user *model.User

	if err := r.Db.Where("id = ?", userid).First(&user).Error; err != nil {
		return "", fmt.Errorf("User not found")
	}

	var group *model.Group

	if err := r.Db.Where("id = ?", id).Preload("Admins").Preload("Members").First(&group).Error; err != nil {
		return "", fmt.Errorf("Group not found")
	}

	if len(group.Admins) == 1 && len(group.Members) > 0 {
		return "You can't leave the group because you are the only admin!", nil
	} else if len(group.Admins) == 1 && len(group.Members) == 0 {

		r.Db.Model(&group).Association("Admins").Delete([]*model.User{user})

		if err := r.Db.Delete(&group).Error; err != nil {
			return "", fmt.Errorf("Failed to Delete Group")
		}

		return "Group Leaved!", nil
	}

	r.Db.Model(&group).Association("Admins").Delete([]*model.User{user})

	return "Group Leaved!", nil
}

// InviteGroup is the resolver for the inviteGroup field.
func (r *mutationResolver) InviteGroup(ctx context.Context, groupid string, receiverid string) (*model.GroupPending, error) {
	// panic(fmt.Errorf("not implemented: InviteGroup - inviteGroup"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	groupPending := &model.GroupPending{
		ID:         uuid.NewString(),
		GroupID:    groupid,
		ReceiverID: receiverid,
		SenderID:   userid,
	}

	if err := r.Db.Create(groupPending).Preload("Group").Preload("Sender").Preload("Receiver").Find(groupPending).Error; err != nil {
		return nil, err
	}

	return groupPending, nil
}

// RejectInvite is the resolver for the rejectInvite field.
func (r *mutationResolver) RejectInvite(ctx context.Context, groupid string, senderid string) (*model.GroupPending, error) {
	// panic(fmt.Errorf("not implemented: RejectInvite - rejectInvite"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var groupPending *model.GroupPending

	if err := r.Db.Where("group_id = ? AND receiver_id = ? AND sender_id = ?", groupid, userid, senderid).First(&groupPending).Error; err != nil {
		return nil, err
	}

	if err := r.Db.Delete(&groupPending).Error; err != nil {
		return nil, err
	}

	return groupPending, nil
}

// AcceptInvite is the resolver for the acceptInvite field.
func (r *mutationResolver) AcceptInvite(ctx context.Context, groupid string, senderid string) (*model.GroupPending, error) {
	// panic(fmt.Errorf("not implemented: AcceptInvite - acceptInvite"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var groupPending *model.GroupPending

	if err := r.Db.Where("group_id = ? AND receiver_id = ? AND sender_id = ?", groupid, userid, senderid).First(&groupPending).Error; err != nil {
		return nil, err
	}

	var group *model.Group

	if err := r.Db.Where("id = ?", groupid).First(&group).Error; err != nil {
		return nil, err
	}

	group.Members = append(group.Members, &model.User{ID: userid})

	if err := r.Db.Save(&group).Error; err != nil {
		return nil, err
	}

	if err := r.Db.Delete(&groupPending).Error; err != nil {
		return nil, err
	}

	return groupPending, nil
}

// RequestGroup is the resolver for the requestGroup field.
func (r *mutationResolver) RequestGroup(ctx context.Context, groupid string) (*model.GroupRequest, error) {
	// panic(fmt.Errorf("not implemented: RequestGroup - requestGroup"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	groupRequest := &model.GroupRequest{
		GroupID: groupid,
		UserID:  userid,
	}

	if err := r.Db.Create(groupRequest).Preload("Group").Preload("User").Find(groupRequest).Error; err != nil {
		return nil, err
	}

	return groupRequest, nil
}

// RejectRequest is the resolver for the rejectRequest field.
func (r *mutationResolver) RejectRequest(ctx context.Context, groupid string, userid string) (*model.GroupRequest, error) {
	// panic(fmt.Errorf("not implemented: RejectRequest - rejectRequest"))

	var groupRequest *model.GroupRequest

	if err := r.Db.Where("group_id = ? AND user_id = ?", groupid, userid).Preload("Group").Preload("User").First(&groupRequest).Error; err != nil {
		return nil, err
	}

	if err := r.Db.Delete(&groupRequest).Error; err != nil {
		return nil, err
	}

	return groupRequest, nil
}

// AcceptRequest is the resolver for the acceptRequest field.
func (r *mutationResolver) AcceptRequest(ctx context.Context, groupid string, userid string) (*model.GroupRequest, error) {
	// panic(fmt.Errorf("not implemented: AcceptRequest - acceptRequest"))

	var groupRequest *model.GroupRequest

	if err := r.Db.Where("group_id = ? AND user_id = ?", groupid, userid).Preload("Group").Preload("User").First(&groupRequest).Error; err != nil {
		return nil, err
	}

	var group *model.Group

	if err := r.Db.Where("id = ?", groupid).Preload("Admins").Preload("Members").First(&group).Error; err != nil {
		return nil, err
	}

	group.Members = append(group.Members, &model.User{ID: userid})

	if err := r.Db.Save(&group).Error; err != nil {
		return nil, err
	}

	if err := r.Db.Delete(&groupRequest).Error; err != nil {
		return nil, err
	}

	return groupRequest, nil
}

// PromoteAdmin is the resolver for the promoteAdmin field.
func (r *mutationResolver) PromoteAdmin(ctx context.Context, groupid string, userid string) (string, error) {
	// panic(fmt.Errorf("not implemented: PromoteAdmin - promoteAdmin"))

	var group *model.Group

	if err := r.Db.Where("id = ?", groupid).Preload("Admins").Preload("Members").First(&group).Error; err != nil {
		return "", err
	}

	group.Admins = append(group.Admins, &model.User{ID: userid})

	r.Db.Model(&group).Association("Members").Delete(&model.User{ID: userid})

	if err := r.Db.Save(&group).Error; err != nil {
		return "", err
	}

	return "", nil
}

// KickMember is the resolver for the kickMember field.
func (r *mutationResolver) KickMember(ctx context.Context, groupid string, userid string) (string, error) {
	// panic(fmt.Errorf("not implemented: KickMember - kickMember"))

	var group *model.Group

	if err := r.Db.Where("id = ?", groupid).Preload("Admins").Preload("Members").First(&group).Error; err != nil {
		return "", err
	}

	r.Db.Model(&group).Association("Members").Delete(&model.User{ID: userid})

	if err := r.Db.Save(&group).Error; err != nil {
		return "", err
	}

	return "", nil
}

// GetUserGroups is the resolver for the getUserGroups field.
func (r *queryResolver) GetUserGroups(ctx context.Context) ([]*model.Group, error) {
	// panic(fmt.Errorf("not implemented: GetUserGroups - getUserGroups"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var groups []*model.Group

	if err := r.Db.Where("id IN (SELECT group_id FROM group_admins WHERE user_id = ?) OR id IN (SELECT group_id FROM group_members WHERE user_id = ?)", userid, userid).Find(&groups).Error; err != nil {
		return nil, err
	}

	return groups, nil
}

// GetGroup is the resolver for the getGroup field.
func (r *queryResolver) GetGroup(ctx context.Context, id string) (*model.Group, error) {
	// panic(fmt.Errorf("not implemented: GetGroup - getGroup"))

	var group *model.Group

	if err := r.Db.Where("id = ?", id).Preload("Admins").Preload("Members").First(&group).Error; err != nil {
		return nil, err
	}

	return group, nil
}

// GetGroups is the resolver for the getGroups field.
func (r *queryResolver) GetGroups(ctx context.Context) ([]*model.Group, error) {
	// panic(fmt.Errorf("not implemented: GetGroups - getGroups"))

	var groups []*model.Group

	if err := r.Db.Where("visibility = ?", "Public").Preload("Admins").Preload("Members").Find(&groups).Error; err != nil {
		return nil, err
	}
	return groups, nil
}

// SearchGroups is the resolver for the searchGroups field.
func (r *queryResolver) SearchGroups(ctx context.Context, search string) ([]*model.Group, error) {
	// panic(fmt.Errorf("not implemented: SearchGroups - searchGroups"))

	var groups []*model.Group

	if err := r.Db.Where("name LIKE ? AND visibility = ?", "%"+search+"%", "Public").Find(&groups).Error; err != nil {
		return nil, err
	}

	return groups, nil
}

// CheckUserRole is the resolver for the checkUserRole field.
func (r *queryResolver) CheckUserRole(ctx context.Context, groupid string) (string, error) {
	// panic(fmt.Errorf("not implemented: CheckUserRole - checkUserRole"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var group *model.Group

	if err := r.Db.Where("id = ?", groupid).Preload("Admins").Preload("Members").First(&group).Error; err != nil {
		return "", err
	}

	for _, admin := range group.Admins {
		// fmt.Println(admin.ID)
		if admin.ID == userid {
			return "admin", nil
		}
	}

	for _, member := range group.Members {
		if member.ID == userid {
			return "member", nil
		}
	}

	return "none", nil
}

// CheckGroupRequest is the resolver for the checkGroupRequest field.
func (r *queryResolver) CheckGroupRequest(ctx context.Context, groupid string) (string, error) {
	// panic(fmt.Errorf("not implemented: CheckGroupRequest - checkGroupRequest"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var groupRequest *model.GroupRequest

	if err := r.Db.Where("group_id = ? AND user_id = ?", groupid, userid).First(&groupRequest).Error; err != nil {
		return "", err
	}

	return "pending", nil
}

// CheckGroupInvite is the resolver for the checkGroupInvite field.
func (r *queryResolver) CheckGroupInvite(ctx context.Context, groupid string) (string, error) {
	panic(fmt.Errorf("not implemented: CheckGroupInvite - checkGroupInvite"))
}

// GetGroupRequest is the resolver for the getGroupRequest field.
func (r *queryResolver) GetGroupRequest(ctx context.Context, groupid string) ([]*model.GroupRequest, error) {
	// panic(fmt.Errorf("not implemented: GetGroupRequest - getGroupRequest"))

	var groupRequests []*model.GroupRequest

	if err := r.Db.Where("group_id = ?", groupid).Preload("Group").Preload("User").Find(&groupRequests).Error; err != nil {
		return nil, err
	}

	return groupRequests, nil
}
