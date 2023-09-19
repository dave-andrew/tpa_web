import { gql } from "@apollo/client";


export const uploadFile = gql`
mutation uploadFile($name: String!, $path: String!, $type: String! $groupid: String!){
  uploadGroupFile(name: $name, path: $path,  groupid: $groupid, type: $type){
    ID
    Name
    Path
    Type
    CreatedAt
    User {
      ID
      Name
      ProfilePicture
    }
    Group {
      ID
      Name
    }
  }
}
`

export const deleteGroupFile = gql`
mutation deleteGroupFile($fileid: String!) {
  deleteGroupFile(fileid: $fileid)
}
`