import { useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import "./FriendCard.css"
import { useState, useEffect } from "react";
import { acceptFriend, removeFriend } from "../apollo/friendmutation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../apollo/notificationmutation";

export default function FriendCard({ data, friendRequest, setFriendRequest }: any) {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [friend, setFriend] = useState<any>();

    const [acc_friend] = useMutation(acceptFriend);
    const [remove_friend] = useMutation(removeFriend);
    const [notif] = useMutation(createNotification);

    useEffect(() => {
        if (data.User.ID === user.id) {
            setFriend(data.Friend);
        } else {
            setFriend(data.User);
        }
    }, []);

    // console.log(friend);

    const handleAddFriend = (e: any) => {
        e.stopPropagation();
        acc_friend({
            variables: {
                friendid: friend.ID,
            }
        }).then((_: any) => {
            setFriendRequest(friendRequest.filter((data: any) => data.User.ID !== friend.ID));
            notif({
                variables: {
                    userid: friend.ID,
                    message: `<p>You are now friends with <b>${user.name}</b>!</p>`
                }
            }).then(_ => {
                toast.success("Friend Request Accepted!");
            })
        }).catch(err => {
            console.log(err);
        })
    }

    const handleRejectFriend = (e: any) => {
        e.stopPropagation();
        // console.log(friend.ID)
        remove_friend({
            variables: {
                friendid: friend.ID,
            }
        }).then(_ => {
            setFriendRequest(friendRequest.filter((data: any) => data.User.ID !== friend.ID));
            notif({
                variables: {
                    userid: friend.ID,
                    message: `<p><b>${user.name}</b> has rejected your friend request!</p>`
                }
            }).then(_ => {
                toast.success("Friend Request Declined!");
            })
        }).catch(err => {
            console.log(err);
        })
    }

    const handleFriendProfile = (e: any) => {
        e.stopPropagation();
        navigate(`/profile/${friend.Name}`, { replace: true });
    }

    return (
        <div>
            <div className="friend-card" onClick={handleFriendProfile}>
                {friend && (
                    <div>
                        <img src={friend.HomePicture} alt="" className="friend-img" />
                        <div className="friend-bio">
                            <div className="friend-name">{friend.Name}</div>
                            <div className="flex flex-col gap-5">
                                <button className="friend-confirm" onClick={handleAddFriend}>Confirm</button>
                                <button className="friend-reject" onClick={handleRejectFriend}>Reject</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}