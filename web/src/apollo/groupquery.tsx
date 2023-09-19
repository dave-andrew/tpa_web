import { gql } from "@apollo/client";



export const getUserGroup = gql`
    query getUserGroups {
        getUserGroups {
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

export const searchGroup = gql`
    query searchGroup($search: String!){
        searchGroups(search: $search){
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

export const getGroup = gql`
    query getGroup($id: ID!){
        getGroup(id:$id){
            ID
            Name
            Members {
                ID
                Name
                ProfilePicture
            }
            Admins {
                ID
                Name
                ProfilePicture
            }
            ImageURL
            Visibility
        }
    }
`

export const checkUserRole = gql`
query checkUserRole($groupid: String!){
  checkUserRole(groupid: $groupid)
}
`

export const checkGroupRequest = gql`
query checkGroupRequest($groupid: String!){
  checkGroupRequest(groupid: $groupid)
}
`

export const getGroupRequest = gql`
query getGroupRequest($groupid: String!){
  getGroupRequest(groupid:$groupid){
    GroupID
    User {
      ID
      Name
      ProfilePicture
    }
  }
}
`

export const getGroups = gql`
query getGroups {
  getGroups {
    ID
    Name
    ImageURL
  }
}
`