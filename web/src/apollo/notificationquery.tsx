import { gql } from "@apollo/client";


export const getNotification = gql`
    query getNotification {
        getNotification {
            ID
            UserID
            Sender {
                ID
                Name
                ProfilePicture
            }
            Message
            Status
            CreatedAt
        }
    }

`

export const countNotification = gql`
    query countNotification {
        countNotification
    }
`

export const getBlockStatus = gql`
query getBlockStatus($userid: String!){
  getBlockStatus(userid: $userid)
}
`