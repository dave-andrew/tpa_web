import { gql } from "@apollo/client"

export const loginUser = gql`
    query LoginUser($email: String!, $pass: String!) {
        login(input: {
            Email: $email,
            Password:$pass
        })
    }
`

export const validate_email = gql`
    query validateEmail($token: String!) {
        ValidateEmail(token: $token)
    }
`

export const changePassEmail = gql`
    query changePassEmail($email: String!){
        changePasswordEmail(email: $email)
    }
`

export const validateToken = gql`
    query validateToken($token: String!){
        validateToken(token: $token)
    }
`

export const getUser = gql`
    query getUser{
        getUser{
            ID
            Name
            Surname
            Email
            DOB
            Gender
            HomePicture
            ProfilePicture
        }
    }
`

export const getAllUser = gql`
    query {
        getAllUser{
            Name
        }
    }
`

export const getUserByName = gql`
    query getUserbyName($name:String!) {
        getUserByName(name: $name){
            ID
            Name
            Surname
            DOB
            HomePicture
            ProfilePicture
        }
    }
`

export const searchUser = gql`
    query searchUser($search: String!){
        searchUser(search: $search){
            ID
            Name
            ProfilePicture
        }
    }
`

export const updateUserProfile = gql`
mutation updateUserProfile($name: String!, $surname: String!, $dob: Time!){
  updateUserProfile(name: $name, surname: $surname, dob: $dob){
    ID
    Name
    Surname
    ProfilePicture
    HomePicture
    DOB
    Gender
    Approved
    
  }
}
`


export const validateeToken = gql`
query validateeToken($token: String!){
  validateeToken(token: $token)
}
`