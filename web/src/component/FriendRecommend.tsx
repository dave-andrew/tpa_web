import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { getMutual, getRecomFriend } from "../apollo/friendquery";
import { useState } from "react";
import { addFriend } from "../apollo/friendmutation";
import RecomFriendCard from "./RecomFriendCard";



export default function FriendRecommend() {

    const [recomFriend, setRecomFriend] = useState<any[]>([]);
    

    console.log(recomFriend)

    const { } = useQuery(getRecomFriend, {
        onCompleted: (data) => {
            setRecomFriend(data.getRecomFriend);
        }
    });

    return (
        <div>
            <div className="width-1000 mg-auto">
                <div className="might-know-container p-10">
                    <h5>People You May Know</h5>
                    <div className="h-300 flex" style={{ gap: "15px", overflowX: "auto" }}>
                        {recomFriend.length === 0 && <div className="flex justify-center items-center">Try to add some friends for new friend recommendation</div>}
                        {recomFriend.length > 0 && recomFriend.map((friend: any) => {
                            return (
                                <RecomFriendCard friend={friend} recomFriend={recomFriend} setRecomFriend={setRecomFriend} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}