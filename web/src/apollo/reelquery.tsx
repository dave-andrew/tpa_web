import { gql } from "@apollo/client";


export const getReel = gql`
    query getReel {
        getReels {
            ID
            Url
            User {
                ID
                Name
                ProfilePicture
            }
            ReelLike
            Share
        }
    }
`

export const getReelStatus = gql`
    query getReelStatus($reelid: ID!){
        getReelLike(reelId: $reelid)
    }
`

export const getReelComments = gql`
    query getReelComments($reelid: String!){
        getReelComments(reelID: $reelid){
            ID
            CommentID
            ReelID
            User {
                ID
                Name
                ProfilePicture
            }
            Message
        }
    }
`

export const getReelCommentReply = gql`
    query getReelCommentReply($reelid: String!, $commentid: String!){
        getReelCommentReply(reelID: $reelid, commentID: $commentid){
            ID
            ReelID
            CommentID
            User {
                ID
                Name
                ProfilePicture
            }
            Message
        }
    }
`

export const reelCountComment = gql`
    query reelCountComment($reelid: String!){
        reelCountComment(reelID: $reelid)
    }
`

export const getUserReel = gql`
query getUserReel($userid: String!){
  getUserReel(userID: $userid){
    ID
    User {
      ID
      Name
      ProfilePicture
    }
    Url
    CreatedAt
    ReelLike
    Share
  }
}
`