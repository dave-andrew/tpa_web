import { useMutation } from "@apollo/client"
import { VscSend } from "react-icons/vsc"
import { createComment } from "../apollo/postmutation"
import { useState } from "react"
import { toast } from "react-toastify"
import RichText from "./RichText"
import { createNotification } from "../apollo/notificationmutation"

export default function AddComment({ user, post, comments, setComments, comment, setComment, repliedUser, setRepliedUser }: any) {

    const [create_comment] = useMutation(createComment)
    const [notif] = useMutation(createNotification);

    const [message, setMessage] = useState("");

    const [key, setKey] = useState(0);

    // console.log(post.User.ID);

    const handleAddComment = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (message) {
            let newMessage = message
            if (repliedUser) {
                newMessage = message.replace(
                    /(<p>)(.*?)(<\/p>)/,
                    `<p><a href="profile/${repliedUser}">@${repliedUser}</a> $2$3`
                );
            }
            if (post) {
                create_comment({
                    variables: {
                        postid: post.ID,
                        message: newMessage,
                        commentid: comment ? comment.ID : null,
                    },
                })
                    .then((data) => {
                        notif({
                            variables: {
                                userid: post.User.ID,
                                message: `<p><b>${user.name}</b> commented on your post.</p>`,
                            }
                        }).then(_ => {
                            setMessage("");
                            setKey(key + 1);
                            setRepliedUser(null);
                            setComment(null);
                            setComments([
                                ...comments,
                                data?.data.createComment,
                            ]);
                            toast.success("Comment Posted!");
                        })
                    })
                    .catch((err) => {
                        console.error(err);
                        toast.error("Failed to post comment.");
                    });
            }
        } else {
            toast.error("Comment cannot be empty.");
        }
    };

    return (
        <div className="add-comment-container">
            <form className="comment-container" onSubmit={handleAddComment}>
                <img src={user.profile} alt="" className="circle comment-avatar" />
                <div className="flex-1">
                    <RichText onContentChange={setMessage} key={key} />
                </div>
                <button className="icon-container" type="submit" onClick={handleAddComment}>
                    <VscSend className="send-icon" />
                </button>
            </form>
        </div>
    )
}