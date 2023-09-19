import { useQuery } from "@apollo/client"
import { getPostByID } from "../apollo/postquery"
import { useState } from "react"
import { getGroupPostByID } from "../apollo/grouppostquery";
import "./ChatPost.css"
import ImageCarousel from "./ImageCarousel";


export default function ChatPost({ postid }: any) {

    const [post, setPost] = useState<any>();
    const [groupPost, setGroupPost] = useState<any>();

    const { } = useQuery(getPostByID, {
        variables: {
            postid: postid
        }, onCompleted: (data) => {
            setPost(data.getPostByID);
        }
    })

    const { } = useQuery(getGroupPostByID, {
        variables: {
            postid: postid
        }, onCompleted: (data) => {
            setGroupPost(data.getGroupPostByID);
        }
    })

    const markup = (html: any) => {
        return { __html: html };
    };

    return (
        <div>
            {post && (
                <div className="chat-post-bg">
                    <div className="chat-post-header">
                        <img src={post.User.ProfilePicture} alt="" className="circle" />
                        <div className="chat-post-name">{post.User.Name}</div>
                    </div>
                    <div className="chat-post-content">
                        <div className="chat-post-description" dangerouslySetInnerHTML={markup(post.Description)}></div>
                        {post.ImageURL.length > 0 && (
                            <ImageCarousel postImage={post.ImageURL} />
                        )}
                    </div>
                </div>
            )}
            {groupPost && (
                <div className="chat-post-bg">
                    <div className="chat-post-header">
                        <img src={groupPost.Group.ImageURL} alt="" className="circle" />
                        <div className="flex flex-col justify-center">
                            <div className="chat-post-group-name">{groupPost.Group.Name}</div>
                            <div className="chat-post-user-name">{groupPost.User.Name}</div>
                        </div>
                    </div>
                    <div className="chat-post-content">
                        <div className="chat-post-description" dangerouslySetInnerHTML={markup(groupPost.Description)}></div>
                        {groupPost.ImageURL.length > 0 && (
                            <ImageCarousel postImage={groupPost.ImageURL} />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}