import { gql } from "@apollo/client";



export const getGroupFiles = gql`
query getGroupFile($groupid: String!){
  getGroupFiles(groupid:$groupid){
		ID
    Name
    Type
    Path
    User {
      ID
      Name
      ProfilePicture
    }
    CreatedAt
  }
}
`