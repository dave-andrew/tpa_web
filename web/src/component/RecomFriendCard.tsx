import { useMutation, useQuery } from "@apollo/client";
import { addFriend } from "../apollo/friendmutation";
import { getMutual } from "../apollo/friendquery";
import { useState } from "react";


export default function RecomFriendCard({friend, recomFriend, setRecomFriend}: any) {

    const [mutual, setMutual] = useState<number>(0);

    const [add_friend] = useMutation(addFriend);
    const { } = useQuery(getMutual, {
        variables: {
            friendid: friend.ID
        }, onCompleted: (data) => {
            setMutual(data.getMutual.length);
        }, onError: (_) => {
            setMutual(0);
        }
    });

    const handleAddFriend = (id: string) => {
        add_friend({
            variables: {
                friendid: id
            }
        }).then((res) => {
            console.log(res);
            setRecomFriend(recomFriend.filter((friend: any) => friend.ID !== id));
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div>
            <div className="flex flex-col card-shadow" key={friend.ID}>
                <img src={friend.ProfilePicture} alt="" className="recom-container" />
                <div>
                    <div className="flex items-center justify-center bold">{friend.Name}</div>
                    <div className="flex items-center justify-center mt-10 mb-10">
                        {mutual} mutual friends
                    </div>
                    <div className="flex justify-center">
                        <button onClick={() => handleAddFriend(friend.ID)} className="add-friend-btn">Add Friend</button>
                    </div>
                </div>
            </div>
        </div>
    )
}