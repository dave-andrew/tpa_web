import { gql } from "@apollo/client";

export const getAllPost = gql`
    query getAllPost($offset: Int!) {
        getAllPost(offset: $offset){
            ID
            Description
            Likes
            Shares
            createdAt
            ImageURL
            User {
                ID
                Name
                ProfilePicture
            }
        }
    }
`

export const getComment = gql`
    query getComment($postid: String!) {
        getPostComment(postID: $postid){
            ID
            Message
            CommentID
            PostID
            User {
                Name
                ProfilePicture
            }
        }
    }
`

export const getReplyComment = gql
`
    query getCommentReply($postid: String!, $commentid: String!) {
        getReply(postID: $postid, commentID: $commentid) {
            ID
            User{
                Name
                ProfilePicture
                HomePicture
            }
            Message
        }
    }
`

export const countComment = gql
`
    query countComment($postid: String!){
        countComment(postID: $postid)
    }
`

export const getLike = gql
`
    query getLike($postid: ID!){
        getLike(postId: $postid)
    }  
`

export const searchPost = gql
`
    query searchPost($search: String!, $offset: Int!){
        searchPost(search: $search, offset: $offset){
            ID
            Description
            Likes
            Shares
            ImageURL
            User {
                ID
                Name
                ProfilePicture
            }
            Visibility
            createdAt
        }
    }
`

export const getUserPost = gql`
query getUserPost($userid: String!, $offset: Int!) {
  getUserPost(userid: $userid, offset: $offset) {
    ID
    Description
    Likes
    Shares
    ImageURL
    User {
      ID
      Name
      ProfilePicture
    }
    createdAt
    Visibility
  }
}
`

export const getPostByID = gql`
query getPostByID($postid: String!){
  getPostByID(postID: $postid){
    ID
    Description
    ImageURL
    User {
      ID
      Name
      ProfilePicture
    }
    createdAt
    Visibility
  }
}
`