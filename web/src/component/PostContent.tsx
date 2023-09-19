import { BsFillTrashFill, BsHandThumbsUpFill } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import ImageCarousel from "./ImageCarousel";
import { FcLike } from "react-icons/fc";
import { FaComment, FaShare } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { countComment } from "../apollo/postquery";
import ChatListModal from "./ChatListModal";
import { sharePost } from "../apollo/postmutation";


export default function PostContent({ post, setPost, handleComment, calculateUploadTime, createMarkUp, handleDeletePost }: any) {

    const { user } = useAuth();

    const [count_comment] = useLazyQuery(countComment);

    const [share_post] = useMutation(sharePost, {
        variables: {
            postid: post.ID
        }
    })

    const [cc, setCC] = useState<any>(0);
    const [toggleFriend, setToggleFriend] = useState<boolean>(false);

    useEffect(() => {
        count_comment({
            variables: {
                postid: post.ID
            }
        }).then((data: any) => {
            setCC(data.data.countComment);
        }).catch((err: any) => {
            console.log(err);
        });
    }, [])

    const handleToggleFriend = () => {
        setToggleFriend(!toggleFriend)
    }

    return (
        <div className="shadow">
            {toggleFriend && (
                <ChatListModal handleToggle={handleToggleFriend} postid={post.ID} share={share_post} />
            )}
            <div key={post.ID} className="bg mt-15">
                <div className="flex" style={{ justifyContent: "space-between" }}>
                    <div className="flex">
                        <img src={post.User.ProfilePicture} alt="" className="circle" />
                        <div className="flex flex-col ml-10">
                            <div>{post.User.Name}</div>
                            <div className="mt-3 size-10">{calculateUploadTime(post.createdAt)}</div>
                        </div>
                    </div>
                    {user.name === post.User.Name && (
                        <BsFillTrashFill className="trash-icon" onClick={() => handleDeletePost(post.ID)} />
                    )}
                </div>
                <div dangerouslySetInnerHTML={createMarkUp(post.Description)} style={{ wordWrap: "break-word" }}></div>
                <div>
                    {post.ImageURL.length > 0 && (
                        <ImageCarousel postImage={post.ImageURL}></ImageCarousel>
                    )}
                </div>
                <div className="more-info">
                    <div className="ml-10"><FcLike /> {post.Likes}</div>
                    <div className="flex gap-10 mr-10">
                        <div><FaComment /> {cc}</div>
                        <div><FaShare /> {post.Shares}</div>
                    </div>
                </div>
                <hr className="mt-10 mb-10" />
                <div className="grid">
                    <div className="self-center pointer flex gap-5 items-center"><BsHandThumbsUpFill />Like</div>
                    <div className="self-center pointer flex gap-5 items-center" onClick={() => {
                        setPost(post);
                        handleComment();
                    }}><FaComment />Comment</div>
                    <div className="self-center pointer flex gap-5 items-center" onClick={() => {
                        setPost(post);
                        handleToggleFriend();
                    }}><FaShare />Share</div>
                </div>
            </div>
        </div>
    )

}