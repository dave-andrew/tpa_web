import { gql } from "@apollo/client";



export const createGroup = gql`
    mutation createGroup($name: String!, $visibility: String!, $members: [String]){
        createGroup(name: $name, visibility:$visibility, members: $members){
            ID
            Name
            Visibility
            Admins {
                ID
                Name
                ProfilePicture
            }
            Members {
                ID
                Name
                ProfilePicture
            }
        }
    }
`

export const inviteGroup = gql`
mutation inviteGroup($groupid: String!, $receiverid: String!){
  inviteGroup(groupid: $groupid, receiverid:$receiverid){
    ID
    Group {
      ID
      Name
    }
    Sender {
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

export const acceptInvite = gql`
mutation acceptInvite($groupid: String!, $senderid: String!){
  acceptInvite(groupid: $groupid, senderid: $senderid){
    ID
    Group {
      ID
      Name
    }
    Sender {
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

export const rejectInvite = gql`
mutation rejectInvite($groupid: String!, $senderid: String!){
  rejectInvite(groupid: $groupid, senderid: $senderid){
    ID
    Group {
      ID
      Name
    }
    Sender {
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

export const requestGroup = gql`
mutation requestGroup($groupid: String!){
  requestGroup(groupid: $groupid){
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

export const updateGroupImage = gql`
mutation updateGroupImage($id: ID!, $image: String!) {
  updateGroupImage(id: $id, image: $image){
    ImageURL
  }
}
`