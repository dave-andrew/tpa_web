import LoggedNavBar from "../component/LoggedNavBar";
import "./Group.css"
import GroupSidebar from "../component/GroupSidebar";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { getAllGroupPost } from "../apollo/grouppostmutation";
import { useEffect, useRef, useState } from "react";
import GroupCommentModal from "../component/GroupCommentModal";
import GroupContent from "../component/GroupContent";
import { toast } from "react-toastify";
import { deleteGroupPost } from "../apollo/grouppostquery";
import { debounce } from "lodash";
import "../component/PostModal.css"


export default function Group() {

    const [postList, setPostList] = useState<any[]>([]);
    const [fetchNextPosts, {loading: loading1}] = useLazyQuery(getAllGroupPost);

    // console.log(postList)

    const [isComment, setIsComment] = useState<boolean>(false);
    const [post, setPost] = useState<any>();

    const [delete_post] = useMutation(deleteGroupPost);

    const bottomRef = useRef<any>();

    let i: number = 1;

    const { loading, data, error } = useQuery(getAllGroupPost, {
        variables: {
            offset: 0,
        }
    });

    useEffect(() => {
        if (data) {
            setPostList(data?.getAllGroupPost);
        }
    }, [data])

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
                postid: id
            }
        }).then((data) => {
            toast.success(data?.data?.deleteGroupPost);
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
            if (data && data.data.getAllGroupPost.length > 0) {
                const newPosts = data.data.getAllGroupPost;
                setPostList(prevPosts => [...prevPosts, ...newPosts]);
                i++;
                console.log(i)
            }
        }).catch(err => {
            console.log(err);
        });
    }, 300);

    const markup = (html: String) => {
        return { __html: html };
    }

    // console.log(data);

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
        <div>
            <LoggedNavBar />
            <div className="group-grid">
                <GroupSidebar />
                <div className="group-post-content">
                    {postList.map((post) => (
                        <GroupContent post={post} setPost={setPost} handleComment={handleComment} calculateUploadTime={calculateUploadTime} markup={markup} handleDeletePost={handleDeletePost} />
                    ))}
                </div>
            </div>
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