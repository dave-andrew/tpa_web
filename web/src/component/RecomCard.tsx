import { useMutation } from "@apollo/client";
import { addFriend } from "../apollo/friendmutation";
import { toast } from "react-toastify";
import { createNotification } from "../apollo/notificationmutation";
import { useAuth } from "../context/AuthContext";


export default function RecomCard({data, recomFriend, setRecomFriend}: any) {

    const [add_friend] = useMutation(addFriend);
    const [notif] = useMutation(createNotification);

    const { user } = useAuth();

    const handleAddFriend = () => {
        add_friend({
            variables: {
                friendid: data.ID,
            }
        }).then(_ => {
            setRecomFriend(recomFriend.filter((data: any) => data.ID !== data.ID));
            notif({
                variables: {
                    userid: data.ID,
                    message: `<p><b>${user.name}</b> has sent a friend request!</p>`
                }
            }).then(_ => {
                toast.success("Friend Request Sent!");
            })
        }).catch(err => {
            console.log(err);
        })
    }

    const handleRemoveRecom = () => {
        setRecomFriend(recomFriend.filter((data: any) => data.ID !== data.ID));
    }

    return (
        <div>
            <div className="friend-card">
                <img src={data.ProfilePicture} alt="" className="friend-img" />
                <div className="friend-bio">
                    <div className="friend-name">{data.Name}</div>
                    <div className="flex flex-col gap-5">
                        <button className="friend-confirm" onClick={handleAddFriend}>Add Friend</button>
                        <button className="friend-reject" onClick={handleRemoveRecom}>Remove</button>
                    </div>
                </div>
            </div>
        </div>
    )

}