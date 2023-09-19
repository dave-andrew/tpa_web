import { useLazyQuery, useQuery } from "@apollo/client";
import { useAuth } from "../../context/AuthContext"
import GroupPostModal from "../GroupPostModal";
import "./Discussion.css"
import { useState, useEffect, useRef } from "react"
import { getGroupPost } from "../../apollo/grouppostmutation";
import { debounce } from "lodash";
import { useMutation } from "@apollo/client";
import { deletePost } from "../../apollo/postmutation";
import { toast } from "react-toastify";
import GroupContent from "../GroupContent";
import GroupCommentModal from "../GroupCommentModal";


export default function Discussion({ group }: any) {
    // console.log(group)

    const { user } = useAuth();

    const [createPost, setCreatePost] = useState<boolean>(false);

    const [postList, setPostList] = useState<any[]>([])

    const { loading } = useQuery(getGroupPost, {
        variables: {
            groupid: group.ID,
            offset: 0,
        }, onCompleted: (data) => {
            setPostList(data?.getGroupPost)
        }
    })
    const [fetchNextPosts, {loading: loading1}] = useLazyQuery(getGroupPost);

    const [isComment, setIsComment] = useState<boolean>(false);
    const [post, setPost] = useState<any>();

    const [delete_post] = useMutation(deletePost);

    const bottomRef = useRef<any>();

    let i: number = 1;

    const handleCreatePost = () => {
        setCreatePost(!createPost);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleComment = () => {
        setIsComment(!isComment)
    }

    const calculateUploadTime = (date: string) => {
        const dateFormat = new Date(date);
        const now = new Date();
        const timeDifference = now.getTime() - dateFormat.getTime();

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) {
            return `${years} ${years === 1 ? 'year' : 'years'} ago`;
        } else if (months > 0) {
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        } else if (days > 0) {
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else if (hours > 0) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else if (minutes > 0) {
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else {
            return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
        }
    }

    const handleDeletePost = (id: string) => {
        delete_post({
            variables: {
                postID: id
            }
        }).then((data) => {
            toast.success(data?.data?.deletePost);
        }).catch(err => {
            console.log(err);
        });
    }
    // const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

    const handleScroll = () => {
        const rect = bottomRef?.current?.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
            debouncedRefetchPost();
        }
    };

    const debouncedRefetchPost = debounce(() => {
        fetchNextPosts({
            variables: {
                offset: i
            }
        }).then(data => {
            if (data && data.data.getAllPost.length > 0) {
                const newPosts = data.data.getAllPost;
                setPostList(prevPosts => [...prevPosts, ...newPosts]);
                i++;
                console.log(i)
            }
        }).catch(err => {
            console.log(err);
        });
    }, 300);

    const createMarkUp = (html: String) => {
        return { __html: html };
    }

    return (
        <div>
            <div className="discussion-grid">
                <div>
                    <div className="column-1">
                        <div className="flex">
                            <img src={user.profile} alt="" className="circle" />
                            <input type="text" className="input-layout" placeholder="What's on your mind?" onFocus={handleCreatePost} />
                        </div>
                    </div>
                    <div>
                        {postList.map((post) => (
                            <GroupContent post={post} setPost={setPost} handleComment={handleComment} calculateUploadTime={calculateUploadTime} markup={createMarkUp} handleDeletePost={handleDeletePost} />
                        ))}
                    </div>
                </div>
                <div>
                    <div className="column-2">
                        About
                    </div>
                </div>
            </div>
            {createPost && (
                <GroupPostModal group={group} handleInputActive={handleCreatePost} />
            )}
            {isComment && (
                <GroupCommentModal post={post} handleComment={handleComment} calculateUploadTime={calculateUploadTime} />
            )}
            {(loading || loading1) && (
                <div className="loading-skeleton">
                    <div className="white-swipe"></div>
                </div>
            )}
            <div ref={bottomRef}></div>
        </div>
    )
}