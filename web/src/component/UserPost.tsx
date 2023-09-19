import { debounce } from "lodash";
import PostContent from "./PostContent";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { getUserPost } from "../apollo/postquery";
import CommentModal from "./CommentModal";
import { useEffect, useRef, useState } from "react";
import { deletePost } from "../apollo/postmutation";
import { toast } from "react-toastify";


export default function UserPost({ userid }: any) {

    const [postList, setPostList] = useState<any[]>([]);
    const [fetchNextPosts] = useLazyQuery(getUserPost);

    const [isComment, setIsComment] = useState<boolean>(false);

    // For comment modal ntar
    const [post, setPost] = useState<any>();

    const [delete_post] = useMutation(deletePost);

    const bottomRef = useRef<any>();

    let i: number = 1;

    const { loading, error } = useQuery(getUserPost, {
        variables: {
            userid: userid,
            offset: 0,
        }, onCompleted: (data) => {
            setPostList(data.getUserPost);
        }
    });

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

    const handleScroll = () => {
        const rect = bottomRef?.current?.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
            debouncedRefetchPost();
        }
    };

    const debouncedRefetchPost = debounce(() => {
        fetchNextPosts({
            variables: {
                userid: userid,
                offset: i
            }
        }).then(data => {
            console.log(data);
            if (data && data.data.getUserPost.length > 0) {
                const newPosts = data.data.getUserPost;
                setPostList((prevPosts: any) => [...prevPosts, ...newPosts]);
                i++;
                console.log(i)
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }, 300);

    const createMarkUp = (html: String) => {
        return { __html: html };
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
        <div>
            {postList.map((post) => (
                <PostContent post={post} setPost={setPost} handleComment={handleComment} calculateUploadTime={calculateUploadTime} createMarkUp={createMarkUp} handleDeletePost={handleDeletePost} />
            ))}
            {isComment && (<CommentModal post={post} handleComment={handleComment} calculateUploadTime={calculateUploadTime} />)}
            <div ref={bottomRef}></div>
        </div>
    )
}