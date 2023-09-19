import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import "./CommentModal.css"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import ImageCarousel from "./ImageCarousel";
import { FcLike } from "react-icons/fc";
import { FaComment, FaShare } from "react-icons/fa";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { countGroupComment, getGroupComment, likeGroupPost, unlikeGroupPost } from "../apollo/grouppostmutation";
import AddGroupComment from "./AddGroupComment";
import GroupReply from "./GroupReply";
import { getGroupLike } from "../apollo/grouppostquery";

export default function GroupCommentModal({ post, handleComment, calculateUploadTime }: any) {

    // console.log(post.ID)

    const { user } = useAuth();
    // console.log(user);
    const [comments, setComments] = useState<any>([]);

    // console.log(comments)

    const [comment, setComment] = useState<any>();
    const [repliedUser, setRepliedUser] = useState<string>();

    const [count_comment] = useLazyQuery(countGroupComment);

    const { loading, error } = useQuery(getGroupComment, {
        variables: {
            postid: post.ID
        },
        onCompleted: (data) => {
            console.log(data)
            setComments(data?.getGroupPostComment);
        }
    });

    const [like_status] = useLazyQuery(getGroupLike);

    const [like_post] = useMutation(likeGroupPost);
    const [unlike_post] = useMutation(unlikeGroupPost);

    const [cc, setCC] = useState<any>(0);
    const [likeStatus, setLikeStatus] = useState<boolean>(false);

    const [likeCount, setLikeCount] = useState<number>(post.Likes);

    useEffect(() => {
        count_comment({
            variables: {
                postid: post.ID
            }
        }).then((data: any) => {
            // console.log(data);
            setCC(data.data.countGroupComment);
        }).catch((err: any) => {
            console.log(err);
        });

        like_status({
            variables: {
                postid: post.ID,
            }
        }).then((data: any) => {
            // console.log(data);
            setLikeStatus(data.data.getLike);
        }).catch((err: any) => {
            console.log(err);
        })
    }, [])

    const handleLikePost = () => {
        like_post({
            variables: {
                postid: post.ID,
            }
        }).catch((err: any) => {
            console.log(err);
        }).then((data: any) => {
            // console.log(data);
            if (data?.data?.likeGroupPost == "Liked") {
                setLikeCount(likeCount + 1);
                setLikeStatus(true);
            }
        });
    }

    const handleUnlikePost = () => {
        unlike_post({
            variables: {
                postid: post.ID,
            }
        }).catch((err: any) => {
            console.log(err);
        }).then((data: any) => {
            if (data.data?.unlikeGroupPost == "Unliked") {
                setLikeCount(likeCount - 1);
                setLikeStatus(false);
            }
        });
    }

    const markup = (jt: string) => {
        return { __html: jt };
    }

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (error) {
        console.log(error);
    }

    return (
        <div className="modal">
            <div className="black-bg"></div>
            <IoIosCloseCircleOutline onClick={handleComment} className="close-button" />
            <div className="modal-content">
                <div className="flex justify-center items-center size-20 bold p-20">
                    {post.User.Name}'s Post
                </div>
                <hr style={{ marginBottom: "0px" }} />
                <div className="p-20">
                    <div className="post">
                        <div className="flex mb-10">
                            <img src={post.Group.ImageURL} alt="" className="circle" />
                            <div className="flex flex-col ml-10">
                                <div className="group-post-name">{post.Group.Name}</div>
                                <div className="flex items-center">
                                    <div>{post.User.Name}</div>
                                    <div>・</div>
                                    <div>{calculateUploadTime(post.createdAt)}</div>
                                </div>
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={markup(post.Description)}></div>
                        <div>
                            {post.ImageURL.length > 1 && (
                                <ImageCarousel postImage={post.ImageURL}></ImageCarousel>
                            )}
                        </div>
                        <div className="more-info">
                            <div><FcLike /> {likeCount}</div>
                            <div className="flex gap-10">
                                <div><FaComment /> {cc}</div>
                                <div><FaShare /> {post.Shares}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="mt-10 mb-10" />
                <div className="grid">
                    {likeStatus ? (
                        <div className="self-center pointer flex gap items-center" onClick={handleUnlikePost} >
                            <BsHandThumbsUpFill />
                            <div>Like</div>
                        </div>
                    ) : (
                        <div className="self-center pointer flex gap items-center" onClick={handleLikePost} >
                            <BsHandThumbsUp />
                            <div>Like</div>
                        </div>
                    )}
                    <div className="self-center pointer flex gap items-center">
                        <FaComment />
                        <div>Comment</div>
                    </div>
                    <div className="self-center pointer flex gap items-center">
                        <FaShare />
                        <div>Share</div>
                    </div>
                </div>
                <hr className="mt-10 mb-10" />
                <div className="p-20">
                    <div>
                        {comments.length <= 0 && (
                            <div className="comment">Be the first one to comment this post!</div>
                        )}
                        {comments.length > 0 && comments.map((comment: any) => (
                            <div key={comment.ID} className="comment">
                                <div className="comment-header">
                                    <img src={comment.User.ProfilePicture} alt="" className="circle" />
                                    <div className="user-name">{comment.User.Name}</div>
                                </div>
                                <div className="comment-message" dangerouslySetInnerHTML={markup(comment.Message)}></div>
                                <div className="reply" onClick={() => setComment(comment)}>Reply</div>
                                <GroupReply post={post.ID} comment={comment} markup={markup} setRepliedUser={setRepliedUser} setComment={setComment}></GroupReply>
                            </div>
                        ))}

                    </div>
                </div>
                <AddGroupComment user={user} post={post} comments={comments} setComments={setComments} comment={comment} setComment={setComment} repliedUser={repliedUser} setRepliedUser={setRepliedUser}></AddGroupComment>
            </div>
        </div>
    )
}