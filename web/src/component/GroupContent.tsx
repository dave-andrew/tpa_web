import { BsHandThumbsUpFill } from "react-icons/bs";
import ImageCarousel from "./ImageCarousel";
import { FcLike } from "react-icons/fc";
import { FaComment, FaShare } from "react-icons/fa";
import { useLazyQuery, useMutation } from "@apollo/client";
import { countGroupComment, shareGroupPost } from "../apollo/grouppostmutation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Trash from "./Trash";
import ChatListModal from "./ChatListModal";



export default function GroupContent({ post, setPost, handleComment, calculateUploadTime, markup, handleDeletePost }: any) {

    const navigate = useNavigate();

    const [share_group_post] = useMutation(shareGroupPost, {
        variables: {
            postid: post.ID
        }
    })

    const handleGroup = (id: string) => {
        navigate(`/group/${id}`, { replace: true });
    }

    const handleUser = (name: string) => {
        navigate(`/profile/${name}`, { replace: true });
    }

    const [count_comment] = useLazyQuery(countGroupComment);

    const [cc, setCC] = useState<any>(0);

    useEffect(() => {
        count_comment({
            variables: {
                postid: post.ID
            }
        }).then((data: any) => {
            setCC(data.data.countGroupComment);
        }).catch((err: any) => {
            console.log(err);
        });
    }, [])

    const [toggleShare, setToggleShare] = useState<boolean>(false);

    const handleToggleShare = () => {
        setToggleShare(!toggleShare);
    }

    return (
        <div className="group-post-box" key={post.ID}>
            <div className="flex items-center justify-between">
                {toggleShare && (
                    <ChatListModal handleToggle={handleToggleShare} postid={post.ID} share={share_group_post} />
                )}
                <div>
                    <div className="flex items-center">
                        <img src={post.Group.ImageURL} alt="" className="circle" />
                        <div className="flex flex-col justify-center">
                            <div className="group-post-name" onClick={() => handleGroup(post.Group.ID)}>{post.Group.Name}</div>
                            <div className="flex items-center">
                                <div className="group-post-user" onClick={() => handleUser(post.User.Name)}>{post.User.Name}</div>
                                <div>・</div>
                                <div>{calculateUploadTime(post.createdAt)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Trash groupid={post.Group.ID} post={post} handleDeletePost={handleDeletePost} />
            </div>
            <div dangerouslySetInnerHTML={markup(post.Description)} style={{ wordWrap: "break-word" }}></div>
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
                    handleToggleShare();
                }}><FaShare />Share</div>
            </div>
        </div>
    )
}