import { gql } from "@apollo/client";


export const createComment = gql
`
    mutation createComment($message:String!, $postid: String!, $commentid: String){
        createComment(message: $message, postID: $postid, commentID: $commentid){
            Message
            User {
                Name
                ProfilePicture
            }
        }
    }
`

export const createPost = gql
`
    mutation createPost($newPost:NewPost!) {
        createPost(post: $newPost){
            ID
            Description
            ImageURL
            Likes
            Shares
            createdAt
        }
    }
`

export const deletePost = gql
`
    mutation deletePost($postID: String!) {
        deletePost(postID: $postID)
    }
`

export const likePost = gql
`
    mutation likePost($postid: ID!){
        likePost(postId: $postid)
    }
`

export const unlikePost = gql
`
    mutation unlikePost($postid: ID!){
        unlikePost(postId: $postid)
    }
`

export const sharePost = gql`
mutation sharePost($postid: String!){
  sharePost(postID: $postid)
}
`