import { FaComment, FaShare } from "react-icons/fa";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useState, useRef, useEffect } from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { createReelComment, likeReel, unlikeReel } from "../apollo/reelmutation";
import { getReelComments, getReelStatus, reelCountComment } from "../apollo/reelquery";
import RichText from "./RichText";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import ReelReply from "./ReelReply";
import { AiOutlineCloseCircle } from "react-icons/ai";


export default function ReelContent({ reelData, handleNext, handlePrev }: any) {
    const [like, setLike] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<any>(0);
    const [duration, setDuration] = useState<any>(0);

    const videoRef = useRef<HTMLVideoElement>(null);

    const [likes, setLikes] = useState<any>(0);
    const [shares, setShares] = useState<any>(0);
    const [repliedUser, setRepliedUser] = useState<string | null>(null);

    const [toggleComment, setToggleComment] = useState<boolean>(false);

    const [get_reel_status] = useLazyQuery(getReelStatus)

    const [comment, setComment] = useState<any[]>([]);

    const [load_reel_comment] = useLazyQuery(getReelComments);

    const [message, setMessage] = useState<string>("");
    const [key, setKey] = useState<number>(0);

    const [create_reel_comment] = useMutation(createReelComment);

    const [repliedComment, setRepliedComment] = useState<any>();

    const [commentCount, setCommentCount] = useState<any>(0);

    const [count] = useLazyQuery(reelCountComment);

    const handleCreateComment = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (message) {
            let newMessage = message
            if (repliedUser) {
                newMessage = message.replace(
                    /(<p>)(.*?)(<\/p>)/,
                    `<p><a href="profile/${repliedUser}">@${repliedUser}</a> $2$3`
                );
            }
            create_reel_comment({
                variables: {
                    reelid: reelData.ID,
                    message: newMessage,
                    commentid: repliedComment ? repliedComment.ID : null,
                },
            }).then((data: any) => {
                console.log(data);
                setMessage("");
                setKey(key + 1);
                setRepliedUser(null);
                setMessage("");
                setComment([
                    ...comment,
                    data?.data.createReelComment,
                ]);
                toast.success("Comment Posted!");
            })
                .catch((err) => {
                    console.error(err);
                    toast.error("Failed to post comment.");
                });
        } else {
            toast.error("Comment cannot be empty.");
        }
    };

    const togglePlayPause = () => {
        if (reelData) {
            const video = videoRef.current;
            if (video?.paused) {
                video.play();
            } else {
                video?.pause();
            }
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (reelData) {
            const newTime = parseFloat(e.target.value);
            setCurrentTime(newTime);
            if (videoRef.current) {
                videoRef.current.currentTime = newTime;
            }
        }
    };

    useEffect(() => {
        if (reelData && videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', () => {
                setDuration(videoRef.current?.duration);
            });

            videoRef.current.addEventListener('timeupdate', () => {
                setCurrentTime(videoRef.current?.currentTime);
            });
        }
    }, [reelData]);

    useEffect(() => {
        setCurrentTime(0);
        if (reelData) {
            // console.log(reelData);
            setLikes(reelData.ReelLike);
            setShares(reelData.Share);
            get_reel_status({
                variables: {
                    reelid: reelData.ID
                },
                fetchPolicy: "cache-and-network"
            })
                .then((response) => {
                    const data = response.data || {};
                    const reelLike = data.getReelLike || false;
                    setLike(reelLike);
                })
                .catch((error) => {
                    console.log(error);
                });

            count({
                variables: {
                    reelid: reelData.ID
                },
                onCompleted: (data) => {
                    // console.log(data);
                    setCommentCount(data?.reelCountComment);
                }
            });
        }
    }, [reelData]);


    const [like_reel] = useMutation(likeReel);
    const [unlike_reel] = useMutation(unlikeReel);

    const handleLike = () => {
        like_reel({
            variables: {
                reelid: reelData.ID
            }
        }).catch(err => {
            console.log(err);
        }).then((data: any) => {
            console.log(data?.data?.likeReel)
            if (data?.data?.likeReel == "Liked") {
                setLikes(likes + 1);
                setLike(true);
            }
        })
    }

    const handleUnlike = () => {
        unlike_reel({
            variables: {
                reelid: reelData.ID
            }
        }).catch(err => {
            console.log(err);
        }).then((data: any) => {
            console.log(data?.data?.unlikeReel)
            if (data?.data?.unlikeReel == "Unliked") {
                setLikes(likes - 1);
                setLike(false);
            }
        });
    }

    const handleShowComment = () => {
        console.log(reelData.ID);
        load_reel_comment({
            variables: {
                reelid: reelData.ID
            },
            fetchPolicy: "network-only"
        }).catch(err => {
            console.log(err);
        }).then(data => {
            console.log(data);
            setComment(data?.data.getReelComments);
            setToggleComment(!toggleComment);
        })
    }

    const markup = (jt: string) => {
        return { __html: jt };
    }

    return (
        <div>
            {reelData && (
                <div className="reel-contents">
                    <div className="user-header">
                        <img src={reelData.User.ProfilePicture} alt="" className="circle" />
                        <div style={{ color: "white" }}>{reelData.User.Name}</div>
                    </div>
                    <video ref={videoRef} src={reelData.Url} className="reel" onClick={togglePlayPause} autoPlay loop></video>
                    <div className="engagements">
                        <div className="flex flex-col items-center">
                            {like ?
                                <FcLike className="engagement-btn" onClick={handleUnlike} />
                                :
                                <FcLikePlaceholder className="engagement-btn" onClick={handleLike} />
                            }
                            <div>{likes}</div>
                        </div>
                        <div className="flex flex-col items-center" onClick={handleShowComment}>
                            <FaComment className="engagement-btn" />
                            <div>{commentCount}</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaShare className="engagement-btn" />
                            <div>{shares}</div>
                        </div>
                    </div>
                    <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handlePrev}>
                        <BiLeftArrow className="reel-prev-btn" />
                    </button>
                    <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handleNext}>
                        <BiRightArrow className="reel-next-btn" />
                    </button>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSliderChange}
                        className="video-timeline"
                    />
                    {toggleComment && (
                        <div className="reel-comment-container">
                            <div style={{ position: "relative" }}>
                                <div className="flex ml-30 mt-10 mb-10 justify-between">
                                    <h3>Comments</h3>
                                    <AiOutlineCloseCircle className="close-reel-comment" onClick={handleShowComment} />
                                </div>
                                {comment.length > 0 ? comment.map((c: any) => (
                                    <div className="flex mt-10 ml-30" key={c.id}>
                                        <img src={c.User.ProfilePicture} alt="" className="circle" />
                                        <div className="flex flex-col ml-10 gap-5">
                                            <div className="bold">{c.User.Name}</div>
                                            <div dangerouslySetInnerHTML={markup(c.Message)}></div>
                                            <div className="reply" onClick={() => {
                                                setRepliedUser(c.User.Name);
                                                setRepliedComment(c);
                                            }}>Reply</div>
                                            <ReelReply reel={reelData.ID} comment={c} setRepliedUser={setRepliedUser} setRepliedComment={setRepliedComment} />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="ml-30 mt-10">No comments yet</div>
                                )}
                                <div className="input-comment-container">
                                    <div style={{ flex: "1" }}>
                                        <RichText onContentChange={setMessage} key={key} />
                                    </div>
                                    <button className="reel-comment-btn" onClick={handleCreateComment}><IoSend className="send-icon" /></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
