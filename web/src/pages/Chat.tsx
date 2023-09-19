import { FaSearch } from "react-icons/fa";
import LoggedNavBar from "../component/LoggedNavBar";
import "./Chat.css";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { getUserChat, getUserGroupChat } from "../apollo/chatquery";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [search, setSearch] = useState<string>("");
    const [allChats, setAllChats] = useState<any[]>([]);

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

            setAllChats(combinedChats);
        }
    }, [userChatLoading, userChatData, groupChatLoading, groupChatData, user]);

    const handleNavigateChat = (id: String) => {
        navigate("/chat/" + id, { replace: true });
    }

    const filteredChats = allChats.filter((chat) => {
        if (chat.user) {
            return chat.user.Name.toLowerCase().includes(search.toLowerCase());
        } else if (chat.group) {
            return chat.group.Name.toLowerCase().includes(search.toLowerCase());
        }
        return false;
    });

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
                        {filteredChats.length === 0 ? (
                            <div className="flex justify-center items-center">No matching chats found</div>
                        ) : (
                            filteredChats.map((chat: any) => (
                                <div
                                    className="user-chat"
                                    key={chat.id}
                                    onClick={() => handleNavigateChat(chat.id)}
                                >
                                    {chat.group && (
                                        <div className="flex items-center">
                                            {chat.group.ImageURL ? (
                                                <img src={chat.group.ImageURL} alt="" className="circle" />
                                            ) : (
                                                <div className="circle"></div>
                                            )}
                                            <div>{chat.group.Name}</div>
                                        </div>
                                    )}
                                    {chat.user && (
                                        <div className="flex items-center">
                                            <img src={chat.user.ProfilePicture} alt="" className="circle" />
                                            <div>{chat.user.Name}</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="chat-content">
                    <div className="centered">
                        Select a chat or start a new conversation
                    </div>
                </div>
            </div>
        </div>
    );
}
