import { gql } from "@apollo/client";


export const createGroupPost = gql`
    mutation createGroupPost($post: NewGroupPost!){
        createGroupPost(post: $post){
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
            Group {
                ID
                Name
                ImageURL
            }
        }
    }
`

export const createGroupComment = gql`
mutation createGroupComment($message: String!, $postid: String!, $commentid: String) {
  createGroupComment(message: $message, postID: $postid, commentID: $commentid){
    ID
    Message
    User {
      ID
      Name
      ProfilePicture
    }
    createdAt
  }
}
`

export const deleteGroupPost = gql`
mutation deleteGroupPost($postid: String!){
  deleteGroupPost(postID: $postid)
}
`
export const getGroupPostByID = gql`
query getGroupPostByID($postid: String!){
  getGroupPostByID(postID: $postid){
    ID
    Description
    ImageURL
    Group {
      ID
      Name
      ImageURL
    }
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

export const getGroupLike = gql`
query getGrouplike($postid: ID!) {
  getGroupLike(postId: $postid)
}
`