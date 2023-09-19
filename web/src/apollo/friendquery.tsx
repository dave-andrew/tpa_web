import { gql } from "@apollo/client";



export const getFriendStatus = gql`
    query getFriendStatus($friendid: String!){
        getStatus(friendid: $friendid){
            User{
                Name
            }
            Friend{
                Name
            }
            Status
        }
    }
`

export const getAllFriend = gql`
    query getFriend{
        getFriends{
            User{
                ID
                Name
                HomePicture
                ProfilePicture
            }
            Friend{
                ID
                Name
                HomePicture
                ProfilePicture
            }
            Status
        }
    }
`

export const getFriendRequest = gql`
    query getRequest {
        getRequestFriend {
            User {
                ID
                Name
                HomePicture
                ProfilePicture
            }
            Friend {
                ID
                Name
                HomePicture
                ProfilePicture
            }
        }
    }
`

export const getRecomFriend = gql`
    query getRecomFriend{
        getRecomFriend {
            ID
            Name
            ProfilePicture
        }
    }
`

export const getFriendUser = gql`
    query getFriendUser {
        getFriendUser {
            ID
            Name
            ProfilePicture
        }
    }
`

export const countFriend = gql`
query countFriend{
  countFriend
}
`

export const getUserFriend = gql`
query getUserFriend($userid: String!){
  getUserFriend(userid:$userid) {
    ID
    Name
    ProfilePicture
  }
}
`

export const getMutual = gql`
query getMutual($friendid: String!){
  getMutual(friendid: $friendid){
    ID
    Name
    ProfilePicture
  }
}
`