import { useQuery } from "@apollo/client";
import { getUserChat, getUserGroupChat } from "../apollo/chatquery";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "./FriendListModal.css"

export default function ChatListModal({ handleToggle, postid, share }: any) {

    const { user } = useAuth();

    const [userChat, setUserChat] = useState<any[]>([]);
    const [groupChat, setGroupChat] = useState<any[]>([]);

    const [chosenChat, setChosenChat] = useState<any[]>([]);

    const { } = useQuery(getUserChat, {
        onCompleted: (data) => {
            setUserChat(data.getUserChat);
        }
    })

    const { } = useQuery(getUserGroupChat, {
        onCompleted: (data) => {
            setGroupChat(data.getUserGroupChat);
        }
    })

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedChatId = event.target.value;
        if (chosenChat.includes(selectedChatId)) {
            setChosenChat((prevChosenChat) =>
                prevChosenChat.filter((chatId) => chatId !== selectedChatId)
            );
        } else {
            setChosenChat((prevChosenChat) => [...prevChosenChat, selectedChatId]);
        }
    };

    const handleCancel = () => {
        setChosenChat([]);
        handleToggle();
    }

    const execute = async () => {
        if (chosenChat.length === 0) {
            toast.error("Please choose at least one chat");
            return;
        }

        const promises = chosenChat.map(async (chat) => {
            const messageData = {
                message: "",
                CreatedAt: Timestamp.fromDate(new Date()),
                post: postid,
                userid: user.id,
            }
            share();
            const chatCollection = collection(db, chat);

            await addDoc(chatCollection, messageData);
        })
        await Promise.all(promises);
        toast.success("Post Sent!");
        handleToggle();
    }

    return (
        <div>
            <div className="bg-modal"></div>
            <div className="friend-list-modal">
                <IoIosCloseCircleOutline onClick={handleToggle} className="friend-list-modal-close" />
                <div className="friend-list-header">
                    <div className="friend-list-title">Send To</div>
                </div>
                <div className="friend-list">
                    {userChat.map((data: any) => {
                        let friend = data.User;
                        if (data.User.ID === user.id) {
                            friend = data.Receiver;
                        }
                        return (
                            <div className="friend-item" key={friend.ID}>
                                <label htmlFor={data.ID} className="flex items-center flex-1 padding-friend-item">
                                    <img src={friend.ProfilePicture} alt="" className="circle" />
                                    <div>{friend.Name}</div>
                                </label>
                                <input
                                    type="checkbox"
                                    name={data.ID}
                                    id={data.ID}
                                    value={data.ID}
                                    className="friend-checkbox"
                                    onChange={handleCheckboxChange}
                                    checked={chosenChat.includes(data.ID)}
                                />
                            </div>
                        )
                    })}
                    {groupChat.map((data: any) => (
                        <div className="friend-item" key={data.ID}>
                            <label htmlFor={data.ID} className="flex items-center flex-1 padding-friend-item">
                                <img src={data.Group.ImageURL} alt="" className="circle" />
                                <div>{data.Group.Name}</div>
                            </label>
                            <input
                                type="checkbox"
                                name={data.ID}
                                id={data.ID}
                                value={data.ID}
                                className="friend-checkbox"
                                onChange={handleCheckboxChange}
                                checked={chosenChat.includes(data.ID)}
                            />
                        </div>
                    ))}
                    <div className="flex flex-end mt-20">
                        <button className="friend-cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button className="friend-invite-btn" onClick={execute}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}