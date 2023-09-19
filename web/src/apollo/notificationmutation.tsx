import { gql } from "@apollo/client";



export const createNotification = gql`
    mutation createNotification($userid: String!, $message: String!){
        createNotification(userid: $userid, message: $message){
            ID
            UserID
            Message
            Status
        }
    }
`

export const blockUser = gql`
mutation blockUser($userid: String!){
  blockUser(userid: $userid){
		ID
  }
}
`

export const unblockUser = gql`
mutation unblockUser($userid: String!){
  unblockUser(userid: $userid){
    ID
  }
}
`