import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { searchPost } from "../apollo/postquery"
import CommentModal from "./CommentModal";
import { useEffect, useRef, useState } from "react";
import { deletePost } from "../apollo/postmutation";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import PostContent from "./PostContent";



export default function SearchPost({value}: any) {

    const [postList, setPostList] = useState<any[]>([]);
    const [fetchNextPosts] = useLazyQuery(searchPost);

    const [isComment, setIsComment] = useState<boolean>(false);
    const [post, setPost] = useState<any>();

    const [delete_post] = useMutation(deletePost);

    const bottomRef = useRef<any>();

    let i: number = 1;

    const { loading, data, error } = useQuery(searchPost, {
        variables: {
            search: value,
            offset: 0,
        }
    });

    useEffect(() => {
        if (data) {
            setPostList(data.searchPost);
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
                search: value,
                offset: i
            }
        }).then(data => {
            console.log(data);
            if (data && data.data.searchPost.length > 0) {
                const newPosts = data.data.searchPost;
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

    console.log(data);

    // if (loading) {
    //     return (
    //         <div>
    //             Loading...
    //         </div>
    //     )
    // }

    if (error) {
        console.log(error);
    }

    return (
        <div>
            {postList.map((post: any) => (
                <PostContent post={post} setPost={setPost} handleComment={handleComment} calculateUploadTime={calculateUploadTime} createMarkUp={createMarkUp} handleDeletePost={handleDeletePost} />
            ))}
            {isComment && (<CommentModal post={post} handleComment={handleComment} calculateUploadTime={calculateUploadTime} />)}
            {loading && (
                <div className="loading-skeleton" style={{marginTop: "20px"}}>
                    <div className="white-animation"></div>
                </div>
            )}
            <div ref={bottomRef}></div>
        </div>
    )
}