import { gql } from "@apollo/client";


export const getChat = gql`
query getChat($chatid: ID!){
  getChat(ID: $chatid){
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

export const getUserChat = gql`
query getUserChat{
  getUserChat {
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

export const checkChat = gql`
query checkChat($userid: String!){
  checkChat(user1d:$userid){
    ID
  }
}
`

export const getUserGroupChat = gql`
query getUserGroupChat {
  getUserGroupChat {
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

export const IsUserInGroupChat = gql`
query isUserInGroupChat($chatid: String!){
  isUserInGroupChat(chatid: $chatid){
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

export const getGroupChat = gql`
query getGroupChat($groupid: String!){
  getGroupChat(groupid: $groupid){
    ID
  }
}
`