import LoggedNavBar from "../component/LoggedNavBar";
import "./Friend.css"
import FriendSideBar from "../component/FriendSideBar";
import FriendCard from "../component/FriendCard";
import { useLazyQuery, useQuery } from "@apollo/client";
import { getFriendRequest, getRecomFriend } from "../apollo/friendquery";
import { useState, useEffect } from "react";
import RecomCard from "../component/RecomCard";


export default function Friend() {

    const { data } = useQuery(getFriendRequest);
    const [get_recom_friend] = useLazyQuery(getRecomFriend);

    const [friendRequest, setFriendRequest] = useState<any[]>([]);
    const [recomFriend, setRecomFriend] = useState<any[]>([]);

    // const [mightKnow, setMightKnow] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setFriendRequest(data?.getRequestFriend);
        }
    }, [data])

    useEffect(() => {
        get_recom_friend()
            .then((data: any) => {
                setRecomFriend(data.data.getRecomFriend);
            }).catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <div className="friend-container">
            <LoggedNavBar />
            <div className="grid-layout">
                <FriendSideBar />
                <div className="mt-80 ml-40">
                    <div className="friend-header">Friend Request</div>

                    {friendRequest ? friendRequest.map((data: any) => (
                        <div className="flex">
                            <FriendCard data={data} friendRequest={friendRequest} setFriendRequest={setFriendRequest} />
                        </div>
                    )) : (
                        <h1>No Friend Request</h1>
                    )}
                    <hr className="mt-30 mb-30" style={{ width: "70vw" }} />
                    <div className="friend-header">People You May Know</div>
                    {recomFriend ? recomFriend.map((data: any) => (
                        <div className="flex" key={data.ID}>
                            <RecomCard data={data} recomFriend={recomFriend} setRecomFriend={setRecomFriend} />
                        </div>
                    )) : (
                        <h1>No Friend Recommendation</h1>
                    )}
                </div>
            </div>
        </div>
    )
}