import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { countComment, getComment, getLike } from "../apollo/postquery";
import "./CommentModal.css"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { useAuth } from "../context/AuthContext";
import AddComment from "./AddComment";
import { useState, useEffect } from "react";
import Reply from "./Reply";
import ImageCarousel from "./ImageCarousel";
import { FcLike } from "react-icons/fc";
import { FaComment, FaShare } from "react-icons/fa";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { likePost, unlikePost } from "../apollo/postmutation";

export default function CommentModal({ post, handleComment, calculateUploadTime }: any) {

    const { user } = useAuth();
    const [comments, setComments] = useState<any>([]);

    const [comment, setComment] = useState<any>();
    const [repliedUser, setRepliedUser] = useState<string>();

    const [count_comment] = useLazyQuery(countComment);

    const { loading, error } = useQuery(getComment, {
        variables: {
            postid: post.ID
        },
        onCompleted: (data) => {
            setComments(data?.getPostComment);
        }
    });

    const [like_status] = useLazyQuery(getLike);

    const [like_post] = useMutation(likePost);
    const [unlike_post] = useMutation(unlikePost);

    const [cc, setCC] = useState<any>(0);
    const [likeStatus, setLikeStatus] = useState<boolean>(false);

    const [likeCount, setLikeCount] = useState<number>(post.Likes);

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
            if (data?.data?.likePost == "Liked") {
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
            if (data?.data?.unlikePost == "Unliked") {
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
                            <img src={post.User.ProfilePicture} alt="" className="circle" />
                            <div className="flex flex-col ml-10">
                                <div className="bold">{post.User.Name}</div>
                                <div className="mt-3 size-10">{calculateUploadTime(post.createdAt)}</div>
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
                                <Reply post={post.ID} comment={comment} markup={markup} setRepliedUser={setRepliedUser} setComment={setComment}></Reply>
                            </div>
                        ))}

                    </div>
                </div>
                <AddComment user={user} post={post} comments={comments} setComments={setComments} comment={comment} setComment={setComment} repliedUser={repliedUser} setRepliedUser={setRepliedUser}></AddComment>
            </div>
        </div>
    )
}