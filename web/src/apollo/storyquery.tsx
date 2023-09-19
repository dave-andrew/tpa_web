import { gql } from "@apollo/client";


export const getUserStory = gql`
    query getUserStory($userid: String!) {
        getUserStory(userid: $userid){
            ID
            StoryURL
            Font
            Color
            Text
        }
    }
`

export const checkStory = gql`
    query checkStory($userid: String!) {
        isUserHaveStory(userid: $userid)
    }
`