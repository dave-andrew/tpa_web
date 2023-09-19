import { gql } from "@apollo/client";



export const acceptRequest = gql`
mutation acceptRequest($groupid: String!, $userid: String!){
  acceptRequest(groupid: $groupid, userid: $userid){
    Group {
      ID
      Name
    }
    User {
      ID
      Name
      ProfilePicture
    }
  }
}
`

export const rejectRequest = gql`
mutation rejectRequest($groupid: String!, $userid: String!){
  rejectRequest(groupid: $groupid, userid: $userid){
    Group {
      ID
      Name
    }
    User {
      ID
      Name
      ProfilePicture
    }
  }
}
`

export const leaveGroupMember = gql`
mutation leaveGroupMember($groupid: ID!){
  leaveGroupMember(id: $groupid)
}
`

export const leaveGroupAdmin = gql`
mutation leaveGroupAdmin($groupid: ID!){
  leaveGroupAdmin(id: $groupid)
}
`

export const promoteAdmin = gql`
mutation promoteAdmin($groupid: String!, $userid:String!){
  promoteAdmin(groupid: $groupid, userid: $userid)
}
`

export const kickMember = gql`
mutation kickMember($groupid: String!, $userid: String!){
  kickMember(groupid: $groupid, userid: $userid)
}
`