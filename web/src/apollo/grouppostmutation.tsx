import { gql } from "@apollo/client";


export const getAllGroupPost = gql`
    query getGroupPost($offset: Int!) {
        getAllGroupPost(offset: $offset) {
            ID
            Description
            Likes
            Visibility
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
            createdAt
        }
    }
`

export const likeGroupPost = gql`
    mutation likeGroupPost($postid: ID!){
        likeGroupPost(postId: $postid)
    }
`

export const unlikeGroupPost = gql`
    mutation unlikeGroupPost($postid: ID!){
        unlikeGroupPost(postId: $postid)
    }
`

export const countGroupComment = gql`
query countGroupComment($postid: String!){
  countGroupComment(postID: $postid)
}
`

export const getGroupComment = gql`
query getGroupComment($postid: String!){
  getGroupPostComment(postID: $postid){
    ID
    Message
    User {
      ID
      Name
      ProfilePicture
    }
  }
}
`

export const getGroupPost = gql`
query getGroupPost($groupid: String!, $offset: Int!){
  getGroupPost(groupid: $groupid, offset: $offset){
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
    Visibility
    createdAt
  }
}
`

export const getGroupReply = gql`
query getGroupReply($postid: String!, $commentid: String!){
  getGroupReply(postID: $postid, commentID: $commentid){
    ID
    Message
    User {
      ID
      Name
      ProfilePicture
    }
  }
}
`

export const shareGroupPost = gql`
mutation shareGroupPost($postid: String!){
  shareGroupPost(postID: $postid)
}
`