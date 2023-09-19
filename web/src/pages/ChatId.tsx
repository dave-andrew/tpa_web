import { FaSearch } from "react-icons/fa";
import LoggedNavBar from "../component/LoggedNavBar";
import { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { IsUserInGroupChat, getChat, getUserChat, getUserGroupChat } from "../apollo/chatquery";
import { useAuth } from "../context/AuthContext";
import ChatContent from "../component/ChatContent";
import GroupChat from "../component/GroupChat";

export default function ChatId() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [search, setSearch] = useState<string>("");
    const [allChat, setAllChat] = useState<any[]>([]);
    const [chosenChat, setChosenChat] = useState<any>();

    const [is_user_in_group_chat] = useLazyQuery(IsUserInGroupChat, {
        variables: {
            chatid: id
        }
    });

    const handleNavigateChat = (id: string) => {
        navigate("/chat/" + id, { replace: true });
    }

    const { loading: userChatLoading, data: userChatData } = useQuery(getUserChat);
    const { loading: groupChatLoading, data: groupChatData } = useQuery(getUserGroupChat);

    useEffect(() => {
        if (!userChatLoading && userChatData && !groupChatLoading && groupChatData) {
            const userChats = userChatData.getUserChat.map((chat: any) => {
                return { id: chat.ID, user: chat.User.ID === user.id ? chat.Receiver : chat.User };
            });

            const groupChats = groupChatData.getUserGroupChat.map((chat: any) => {
                return { id: chat.ID, group: chat.Group };
            });

            const combinedChats = [...userChats, ...groupChats];

            setAllChat(combinedChats);
        }
    }, [userChatLoading, userChatData, groupChatLoading, groupChatData, user]);

    const { loading } = useQuery(getChat, {
        variables: {
            chatid: id
        },
        onCompleted: (data) => {
            if (!(user.name === data.getChat.User.Name) && !(user.name === data.getChat.Receiver.Name)) {
                navigate("/chat", { replace: true });
            }
            setChosenChat(data?.getChat);
        },
        onError: (_) => {
            is_user_in_group_chat().then((data) => {
                if (!data.data.isUserInGroupChat) {
                    navigate("/chat", { replace: true });
                } else {
                    setChosenChat(data.data.isUserInGroupChat);
                }
                return;
            }).catch((err) => {
                console.log(err);
                navigate("/chat", { replace: true })
            });
        }
    });

    const filteredChat = allChat.filter((chat) => {
        if (chat.user) {
            return chat.user.Name.toLowerCase().includes(search.toLowerCase());
        } else if (chat.group) {
            return chat.group.Name.toLowerCase().includes(search.toLowerCase());
        }
        return false;
    });

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <div>
            <LoggedNavBar />
            <div className="chat-container">
                <div className="chat-sidebar">
                    <h4 className="chat-header">Chats</h4>
                    <div className="chat-search">
                        {search === "" && <FaSearch className="chat-search-icon" />}
                        <input
                            type="text"
                            placeholder="       Search"
                            className="input"
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>
                    <div className="mt-30 name-list">
                        {filteredChat.length === 0 ? (
                            <div className="flex justify-center items-center">No matching users or groups found</div>
                        ) : (
                            filteredChat.map((data: any) => (
                                <div
                                    className="user-chat"
                                    key={data.id}
                                    onClick={() => handleNavigateChat(data.id)}
                                >
                                    {data.user && (
                                        <div className="flex items-center">
                                            <img src={data.user.ProfilePicture} alt="" className="circle" />
                                            <div>{data.user.Name}</div>
                                        </div>
                                    )}
                                    {data.group && (
                                        <div className="flex items-center">
                                            {data.group.ImageURL ? (
                                                <img src={data.group.ImageURL} alt="" className="circle" />
                                            ) : (
                                                <div className="circle"></div>
                                            )}
                                            <div>{data.group.Name}</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="chat-content">
                    {chosenChat && (
                        <div>
                            {chosenChat.Group && (
                                <GroupChat chatData={chosenChat} />
                            )}
                            {chosenChat.User && (
                                <ChatContent chatUser={chosenChat} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
