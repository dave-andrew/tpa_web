import { useLazyQuery, useMutation } from "@apollo/client"
import { getFriendStatus } from "../apollo/friendquery"
import { useEffect, useState } from "react"
import { addFriend } from "../apollo/friendmutation";
import { createNotification } from "../apollo/notificationmutation";
import { toast } from "react-toastify";


export default function SearchUser({ user }: any) {

    // console.log(user.ID);

    const [get_friend_status] = useLazyQuery(getFriendStatus);

    const [friendStatus, setFriendStatus] = useState<boolean>(false);

    const [add_friend] = useMutation(addFriend);
    const [notif] = useMutation(createNotification);

    useEffect(() => {
        get_friend_status({
            variables: {
                friendid: user.ID
            }
        }).then(data => {
            console.log(data);
            setFriendStatus(data.data.getFriendStatus);
        }).catch(err => {
            console.log(err);
        });
    }, [])

    const handleAddFriend = () => {
        add_friend({
            variables: {
                friendid: user.ID,
            }
        }).then(_ => {
            notif({
                variables: {
                    userid: user.ID,
                    message: `<p><b>${user.name}</b> has sent a friend request!</p>`
                }
            }).then(_ => {
                setFriendStatus(false);
                toast.success("Friend Request Sent!");
            })
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <div className="search-people" key={user.ID}>
            <div className="flex items-center">
                <img src={user.ProfilePicture} alt="" className="circle" />
                <div className="flex flex-col">
                    <div>{user.Name}</div>
                </div>
            </div>
            {friendStatus && (
                <button className="add-friend-btn" onClick={handleAddFriend}>Add Friend</button>
            )}
        </div>
    )
}