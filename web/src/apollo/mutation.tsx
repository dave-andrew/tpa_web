import { gql } from "@apollo/client"

export const create_user = gql`
    mutation createUser($newUser: NewUser!) {
        createUser(
            newUser: $newUser
        )
    }
`

export const change_password = gql`
mutation changePassword($token: String!, $oldpass: String!, $pass: String!) {
  changePassword(token: $token, oldpass: $oldpass, pass: $pass)
}
`

export const change_home_picture = gql`
    mutation changeHomePicture($url: String!) {
        addHomePicture(url:$url)
    }
`

export const change_profile_picture = gql`
    mutation changeProfilePicture($url: String!){
        addProfilePicture(url: $url)
    }
`
