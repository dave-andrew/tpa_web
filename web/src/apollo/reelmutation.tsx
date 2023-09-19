import { gql } from "@apollo/client";


export const createReel = gql`
    mutation createReel($url: String!){
        createReel(url: $url){
            ID
            User {
                ID
                Name
            }
            Url
            ReelLike
            Share
        }
    }
`

export const likeReel = gql`
    mutation likeReel($reelid: ID!){
        likeReel(reelId: $reelid)
    }
`

export const unlikeReel = gql`
    mutation unlikeReel($reelid: ID!){
        unlikeReel(reelId: $reelid)
    }
`

export const createReelComment = gql`
    mutation createReelComment($reelid: String!, $commentid: String, $message: String!){
        createReelComment(reelID: $reelid, commentID: $commentid, message: $message){
            ID
            User {
                ID
                Name
                ProfilePicture
            }
            Message
        }
    }
`