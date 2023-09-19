import { gql } from "@apollo/client";



export const createChat = gql`
mutation createChat($userid: String!){
  createChat(User1ID: $userid){
    ID
    User {
      ID
      Name
      ProfilePicture
    }
		Receiver {
      ID
      Name
      ProfilePicture
    }
  }
}
`

export const createGroupChat = gql`
mutation createGroupChat($groupid: String!, $users: [String!]!) {
	createGroupChat(groupid: $groupid, users: $users){
    ID
    Group {
      ID
      Name
      ImageURL
    }
    Users {
      ID
      Name
      ProfilePicture
    }
  }
}
`

export const addGroupUser = gql`
mutation addGroupUser($groupid: String!, $userid: String!){
  addGroupUser(groupid: $groupid, User: $userid){
    ID
    Group {
      ID
      Name
      ImageURL
    }
    Users {
      ID
      Name
      ProfilePicture
    }
  }
}
`