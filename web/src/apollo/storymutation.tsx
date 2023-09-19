import { gql } from "@apollo/client";


export const createStory = gql`
    mutation createStory($storyurl: String, $color: String, $font: String, $text: String) {
        createStory(StoryURL: $storyurl, Color: $color, Font: $font, Text: $text)
    }
`