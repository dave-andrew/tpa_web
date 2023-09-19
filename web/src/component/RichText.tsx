import { useState, useEffect } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@apollo/client";
import { getAllUser } from "../apollo/query";

export default function RichText({ onContentChange, key }: any) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const { user } = useAuth();

    const { loading, data } = useQuery(getAllUser);

    const [allUserData, setAllUserData] = useState([]);

    const handleEditorStateChange = (newEditorState: any) => {
        setEditorState(newEditorState);
        const rawContentState = convertToRaw(newEditorState.getCurrentContent());

        const markup = draftToHtml(rawContentState, {
            trigger: "#",
            separator: " ",
        });

        const hashtagRegex = /<a href="#([^"]+)" class="wysiwyg-hashtag">([^<]+)<\/a>/g;

        const comRegex = /(\S*\.com)\b/g;

        const modifiedMarkup = markup
            .replace(hashtagRegex, '<a href="search/$1" class="wysiwyg-hashtag">$2</a>')
            .replace(comRegex, '<a href="http://$1" class="wysiwyg-hashtag">$1</a>');


        onContentChange(modifiedMarkup);
    };

    useEffect(() => {
        if (data) {
            const userData = data?.getAllUser.map((data: any) => {
                return { text: data.Name, value: data.Name, url: "profile/" + data.Name };
            });

            setAllUserData(userData);
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Editor
                key={key}
                editorStyle={{ border: "1px solid #e4e6eb" }}
                wrapperClassName="post-text"
                toolbarHidden={true}
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
                placeholder={`What's on your mind, ${user.name}?`}
                mention={{
                    separator: " ",
                    trigger: "@",
                    suggestions: allUserData,
                }}
                hashtag={{
                    separator: " ",
                    trigger: "#",
                }}
            />

        </div>
    );
}
