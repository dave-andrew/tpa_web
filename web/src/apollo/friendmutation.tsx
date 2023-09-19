import { gql } from "@apollo/client";



export const acceptFriend = gql`
    mutation accFriend($friendid: String!) {
        acceptFriend(friendid: $friendid) {
            User {
                Name
            }
            Friend {
                Name
            }
            Status
        }

    }
`

export const addFriend = gql`
    mutation addFriend($friendid: String!) {
        addFriend(friendid: $friendid){
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

export const removeFriend = gql`
    mutation removeFriend($friendid: String!){
        removeFriend(friendid: $friendid) {
            UserID
        }
    }
`