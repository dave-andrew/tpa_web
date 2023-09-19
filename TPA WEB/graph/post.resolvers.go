package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.35

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/dave-andrew/gqlgen-todos/graph/model"
	"github.com/dave-andrew/gqlgen-todos/middleware"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

// CreatePost is the resolver for the createPost field.
func (r *mutationResolver) CreatePost(ctx context.Context, post model.NewPost) (*model.Post, error) {
	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	var user *model.User
	if err := r.Db.Where("ID = ?", userid).First(&user).Error; err != nil {
		return nil, err
	}

	posts := &model.Post{
		ID:          uuid.NewString(),
		Description: post.Description,
		ImageURL:    post.ImageURL,
		UserID:      userid,
		Likes:       0,
		Shares:      0,
		CreatedAt:   time.Now(),
		Visibility:  post.Visibility,
	}

	if err := r.Db.Create(posts).Preload("User").Find(&posts).Error; err != nil {
		return nil, err
	}

	return posts, nil
}

// CreateComment is the resolver for the createComment field.
func (r *mutationResolver) CreateComment(ctx context.Context, message string, postID string, commentID *string) (*model.Comment, error) {
	//panic(fmt.Errorf("not implemented: CreateComment - createComment"))
	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	comment := &model.Comment{
		ID:        uuid.NewString(),
		PostID:    postID,
		CommentID: commentID,
		UserID:    userid,
		Message:   message,
		CreatedAt: time.Now(),
	}

	if err := r.Db.Create(&comment).Preload("User").Find(&comment).Error; err != nil {
		return nil, err
	}

	return comment, nil
}

// DeletePost is the resolver for the deletePost field.
func (r *mutationResolver) DeletePost(ctx context.Context, postID string) (string, error) {
	//panic(fmt.Errorf("not implemented: DeletePost - deletePost"))
	var post *model.Post
	if err := r.Db.Where("id = ?", postID).First(&post).Error; err != nil {
		return "", err
	}

	if err := r.Db.Delete(&post).Error; err != nil {
		return "", err
	}

	return "Post Deleted!", nil
}

// CreateGroupPost is the resolver for the createGroupPost field.
func (r *mutationResolver) CreateGroupPost(ctx context.Context, post model.NewGroupPost) (*model.GroupPost, error) {
	// panic(fmt.Errorf("not implemented: CreateGroupPost - createGroupPost"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	groupPost := &model.GroupPost{
		ID:          uuid.NewString(),
		Description: post.Description,
		ImageURL:    post.ImageURL,
		UserID:      userid,
		Likes:       0,
		Shares:      0,
		CreatedAt:   time.Now(),
		Visibility:  post.Visibility,
		GroupID:     post.GroupID,
	}

	if err := r.Db.Create(groupPost).Preload("User").Preload("Group").Find(&groupPost).Error; err != nil {
		return nil, err
	}

	return groupPost, nil
}

// CreateGroupComment is the resolver for the createGroupComment field.
func (r *mutationResolver) CreateGroupComment(ctx context.Context, message string, postID string, commentID *string) (*model.GroupComment, error) {
	// panic(fmt.Errorf("not implemented: CreateGroupComment - createGroupComment"))

	token := ctx.Value("TokenValue")

	jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	claims, _ := jwtToken.Claims.(jwt.MapClaims)

	userid, _ := claims["user_id"].(string)

	groupComment := &model.GroupComment{
		ID:             uuid.NewString(),
		GroupPostID:    postID,
		GroupCommentID: commentID,
		UserID:         userid,
		Message:        message,
		CreatedAt:      time.Now(),
	}

	if err := r.Db.Create(&groupComment).Preload("User").Find(&groupComment).Error; err != nil {
		return nil, err
	}

	return groupComment, nil
}

// DeleteGroupPost is the resolver for the deleteGroupPost field.
func (r *mutationResolver) DeleteGroupPost(ctx context.Context, postID string) (string, error) {
	// panic(fmt.Errorf("not implemented: DeleteGroupPost - deleteGroupPost"))

	var groupPost *model.GroupPost

	if err := r.Db.Where("id = ?", postID).First(&groupPost).Error; err != nil {
		return "", err
	}

	if err := r.Db.Delete(&groupPost).Error; err != nil {
		return "", err
	}

	return "Post Deleted!", nil
}

// SharePost is the resolver for the sharePost field.
func (r *mutationResolver) SharePost(ctx context.Context, postID string) (string, error) {
	// panic(fmt.Errorf("not implemented: SharePost - sharePost"))

	var post *model.Post

	if err := r.Db.Where("id = ?", postID).First(&post).Error; err != nil {
		return "", err
	}

	post.Shares = post.Shares + 1

	if err := r.Db.Save(&post).Error; err != nil {
		return "", err
	}

	return "Post Shared!", nil
}

// ShareGroupPost is the resolver for the shareGroupPost field.
func (r *mutationResolver) ShareGroupPost(ctx context.Context, postID string) (string, error) {
	// panic(fmt.Errorf("not implemented: ShareGroupPost - shareGroupPost"))

	var groupPost *model.GroupPost

	if err := r.Db.Where("id = ?", postID).First(&groupPost).Error; err != nil {
		return "", err
	}

	groupPost.Shares = groupPost.Shares + 1

	if err := r.Db.Save(&groupPost).Error; err != nil {
		return "", err
	}

	return "Post Shared!", nil
}

// GetAllPost is the resolver for the getAllPost field.
func (r *queryResolver) GetAllPost(ctx context.Context, offset int) ([]*model.Post, error) {
	// token := ctx.Value("TokenValue")

	// jwtToken, _ := middleware.ValidateJWTToken(token.(string))

	// claims, _ := jwtToken.Claims.(jwt.MapClaims)

	// userid, _ := claims["user_id"].(string)

	var allPost []*model.Post

	if err := r.Db.Order("created_at ASC").Offset(offset * 5).Limit(5).Preload("User").Find(&allPost).Error; err != nil {
		return nil, err
	}
	// if Redis, err := r.Redis.Get(ctx, fmt.Sprintf("allPost:%s", userid)).Result(); err != nil {

	// 	if Redis, err := json.Marshal(allPost); err == nil {
	// 		r.Redis.Set(ctx, fmt.Sprintf("allPost:%s", userid), Redis, 1*time.Hour)
	// 	} else {
	// 		return nil, err
	// 	}
	// } else {
	// 	if err := json.Unmarshal([]byte(Redis), &allPost); err != nil {
	// 		return nil, err
	// 	}
	// }

	return allPost, nil
}

// GetPostComment is the resolver for the getPostComment field.
func (r *queryResolver) GetPostComment(ctx context.Context, postID string) ([]*model.Comment, error) {
	var allComment []*model.Comment
	if err := r.Db.Order("created_at ASC").Where("post_id = ? AND comment_id IS NULL", postID).Find(&allComment).Preload("Post").Preload("User").Find(&allComment).Error; err != nil {
		return nil, err
	}

	return allComment, nil
}

// GetReply is the resolver for the getReply field.
func (r *queryResolver) GetReply(ctx context.Context, postID string, commentID string) ([]*model.Comment, error) {
	// panic(fmt.Errorf("not implemented: GetReply - getReply"))

	var allReply []*model.Comment

	if err := r.Db.Where("post_id = ? AND comment_id = ?", postID, commentID).Find(&allReply).Preload("Post").Preload("User").Find(&allReply).Error; err != nil {
		return nil, err
	}

	return allReply, nil
}

// CountComment is the resolver for the countComment field.
func (r *queryResolver) CountComment(ctx context.Context, postID string) (int, error) {
	// panic(fmt.Errorf("not implemented: CountComment - countComment"))

	var count int64

	if err := r.Db.Model(&model.Comment{}).Where("post_id = ?", postID).Count(&count).Error; err != nil {
		return 0, err
	}

	return int(count), nil
}

// SearchPost is the resolver for the searchPost field.
func (r *queryResolver) SearchPost(ctx context.Context, search string, offset int) ([]*model.Post, error) {
	// panic(fmt.Errorf("not implemented: SearchPost - searchPost"))

	var allPost []*model.Post

	if err := r.Db.Where("description LIKE ?", "%"+search+"%").Order("created_at ASC").Offset(offset * 5).Limit(5).Preload("User").Find(&allPost).Error; err != nil {
		return nil, err
	}

	return allPost, nil
}

// GetAllGroupPost is the resolver for the getAllGroupPost field.
func (r *queryResolver) GetAllGroupPost(ctx context.Context, offset int) ([]*model.GroupPost, error) {
	// panic(fmt.Errorf("not implemented: GetAllGroupPost - getAllGroupPost"))

	var allGroupPost []*model.GroupPost

	if err := r.Db.Order("created_at ASC").Offset(offset * 5).Limit(5).Preload("User").Preload("Group").Find(&allGroupPost).Error; err != nil {
		return nil, err
	}

	return allGroupPost, nil
}

// GetGroupPostComment is the resolver for the getGroupPostComment field.
func (r *queryResolver) GetGroupPostComment(ctx context.Context, postID string) ([]*model.GroupComment, error) {
	// panic(fmt.Errorf("not implemented: GetGroupPostComment - getGroupPostComment"))

	var allComment []*model.GroupComment

	if err := r.Db.Order("created_at ASC").Where("group_post_id = ? AND group_comment_id IS NULL", postID).Find(&allComment).Preload("GroupPost").Preload("User").Find(&allComment).Error; err != nil {
		return nil, err
	}

	return allComment, nil
}

// GetGroupReply is the resolver for the getGroupReply field.
func (r *queryResolver) GetGroupReply(ctx context.Context, postID string, commentID string) ([]*model.GroupComment, error) {
	// panic(fmt.Errorf("not implemented: GetGroupReply - getGroupReply"))

	var allReply []*model.GroupComment

	if err := r.Db.Where("group_post_id = ? AND group_comment_id = ?", postID, commentID).Find(&allReply).Preload("GroupPost").Preload("User").Find(&allReply).Error; err != nil {
		return nil, err
	}

	return allReply, nil
}

// CountGroupComment is the resolver for the countGroupComment field.
func (r *queryResolver) CountGroupComment(ctx context.Context, postID string) (int, error) {
	// panic(fmt.Errorf("not implemented: CountGroupComment - countGroupComment"))

	var count int64

	if err := r.Db.Model(&model.GroupComment{}).Where("group_post_id = ?", postID).Count(&count).Error; err != nil {
		return 0, err
	}

	return int(count), nil
}

// SearchGroupPost is the resolver for the searchGroupPost field.
func (r *queryResolver) SearchGroupPost(ctx context.Context, search string, offset int) ([]*model.GroupPost, error) {
	// panic(fmt.Errorf("not implemented: SearchGroupPost - searchGroupPost"))

	var allGroupPost []*model.GroupPost

	if err := r.Db.Where("description LIKE ? AND visibility = ?", "%"+search+"%", "Public").Order("created_at ASC").Offset(offset * 5).Limit(5).Preload("User").Preload("Group").Find(&allGroupPost).Error; err != nil {
		return nil, err
	}

	return allGroupPost, nil
}

// GetUserPost is the resolver for the getUserPost field.
func (r *queryResolver) GetUserPost(ctx context.Context, userid string, offset int) ([]*model.Post, error) {
	// panic(fmt.Errorf("not implemented: GetUserPost - getUserPost"))

	var allPost []*model.Post

	if err := r.Db.Where("user_id = ?", userid).Order("created_at ASC").Offset(offset * 5).Limit(5).Preload("User").Find(&allPost).Error; err != nil {
		return nil, err
	}

	return allPost, nil
}

// GetGroupPost is the resolver for the getGroupPost field.
func (r *queryResolver) GetGroupPost(ctx context.Context, groupid string, offset int) ([]*model.GroupPost, error) {
	// panic(fmt.Errorf("not implemented: GetGroupPost - getGroupPost"))

	var allGroupPost []*model.GroupPost

	if Redis, err := r.Redis.Get(ctx, fmt.Sprintf("group:%s", groupid)).Result(); err != nil {
		if err := r.Db.Where("group_id = ?", groupid).Order("created_at ASC").Offset(offset * 5).Limit(5).Preload("User").Preload("Group").Find(&allGroupPost).Error; err != nil {
			return nil, err
		}

		if Redis, err := json.Marshal(allGroupPost); err == nil {
			r.Redis.Set(ctx, fmt.Sprintf("group:%s", groupid), Redis, 1*time.Hour)
		} else {
			return nil, err
		}
	} else {
		if err := json.Unmarshal([]byte(Redis), &allGroupPost); err != nil {
			return nil, err
		}
	}

	return allGroupPost, nil
}

// GetPostByID is the resolver for the getPostByID field.
func (r *queryResolver) GetPostByID(ctx context.Context, postID string) (*model.Post, error) {
	// panic(fmt.Errorf("not implemented: GetPostByID - getPostByID"))

	var post *model.Post

	if err := r.Db.Where("id = ?", postID).Preload("User").Find(&post).Error; err != nil {
		return nil, err
	}

	return post, nil
}

// GetGroupPostByID is the resolver for the getGroupPostByID field.
func (r *queryResolver) GetGroupPostByID(ctx context.Context, postID string) (*model.GroupPost, error) {
	// panic(fmt.Errorf("not implemented: GetGroupPostByID - getGroupPostByID"))

	var groupPost *model.GroupPost

	if err := r.Db.Where("id = ?", postID).Preload("User").Preload("Group").Find(&groupPost).Error; err != nil {
		return nil, err
	}

	return groupPost, nil
}
