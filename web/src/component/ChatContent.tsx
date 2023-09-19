import { IoSend } from "react-icons/io5";
import RichText from "./RichText";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Timestamp, addDoc, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db, storage } from "../firebase/firebaseConfig";
import { BsFillImageFill } from "react-icons/bs";
import { BiSolidVideoPlus } from "react-icons/bi";
import { MdKeyboardVoice } from "react-icons/md";
import UploadFileChat from "./UploadFileChat";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";


export default function ChatContent({ chatUser }: any) {

    console.log(chatUser)

    const { user } = useAuth();
    const navigate = useNavigate();

    const [message, setMessage] = useState<any>();
    const [key, setKey] = useState<number>(0);

    const [chatData, setChatData] = useState<any[]>([]);

    const videoRef = useRef<HTMLInputElement | null>(null);
    const audioRef = useRef<HTMLInputElement | null>(null);
    const imageRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);

    const [chatWith, setChatWith] = useState<any>();

    useEffect(() => {
        if (chatUser) {
            if (chatUser.User.ID === user.id) {
                setChatWith(chatUser.Receiver)
            } else {
                setChatWith(chatUser.User)
            }
        }
    }, [chatUser, user])

    const handleSendMessage = async () => {
        if (chatUser.ID) {
            try {
                if (!message && !file) {
                    toast.error("Please enter a message or upload a file")
                    return;
                }

                const messageData: any = {
                    chatid: chatUser.ID,
                    user1: user.id,
                    user2: chatWith.ID,
                    message: message || "",
                    createdAt: Timestamp.fromDate(new Date()),
                };

                if (file) {
                    const storageRef = ref(storage, `chat/${user.id}/${file.name}+${new Date()}`);
                    await uploadBytes(storageRef, file);

                    const url = await getDownloadURL(storageRef);

                    if (file.type.startsWith("image/")) {
                        messageData.image = url;
                    } else if (file.type.startsWith("video/")) {
                        messageData.video = url;
                    } else if (file.type.startsWith("audio/")) {
                        messageData.audio = url;
                    }
                }

               

                try {
                    console.log("TESTING DISINI")
                    const chatCollection = collection(db, "chat");
                    await addDoc(chatCollection, messageData);
                    
                }catch(err){
                    console.log(err)
                }

                setKey(key + 1);
                setMessage("");
                setFile(null);

            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    }

    // console.log(chatUser)

    useEffect(() => {
        const getChat = async () => {
            try {
                const chatCollection = collection(db, "chat");

                const chatQuery = query(chatCollection, where("chatid", "==", chatUser.ID), orderBy("createdAt", "asc"));

                const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
                    const chatData = querySnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                        ref: doc.ref,
                    }));
                    setChatData(chatData);
                    console.log("Chat data:", chatData);
                });
                return () => {
                    unsubscribe();
                };
            } catch (error) {
                console.error("Error fetching chat data:", error);
            }
        };

        if (chatUser && user) {
            getChat();
        }
    }, [chatUser, user]);

    const markup = (jt: string) => {
        return { __html: jt };
    }

    const handleChooseImage = () => {
        if (imageRef.current) {
            imageRef.current.click();
        }
    };

    const handleChooseVideo = () => {
        if (videoRef.current) {
            videoRef.current.click();
        }
    };

    const handleChooseVoice = () => {
        if (audioRef.current) {
            audioRef.current.click();
        }
    };

    const handleChangeFile = (e: any) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    if (chatUser && chatWith) {
        return (
            <div className="chat-box">
                <input type="file" accept="image/*" ref={imageRef} className="disappear-input" onChange={handleChangeFile} />
                <input type="file" accept="video/*" ref={videoRef} className="disappear-input" onChange={handleChangeFile} />
                <input type="file" accept="audio/*" ref={audioRef} className="disappear-input" onChange={handleChangeFile} />
                <div className="header">
                    <img src={chatWith.ProfilePicture} alt="" className="circle" />
                    <div style={{ fontWeight: "bold" }}>{chatWith.Name}</div>
                </div>
                <hr />
                <div className="conversation">
                    {chatData && chatData.map((chat: any, index: number) => {
                        return (
                            <div key={index}>
                                {chat.user1 === user.id ? (
                                    <div className="user-message">
                                        <img src={user.profile} alt="" className="circle" />
                                        <div className="user-chat-box">
                                            <div style={{ fontWeight: "bold" }}>Me</div>
                                            {chat.image && (
                                                <img src={chat.image} alt="" className="chat-image" />
                                            )}
                                            {chat.video && (
                                                <video src={chat.video} className="chat-image" controls />
                                            )}
                                            {chat.audio && (
                                                <audio src={chat.audio} className="chat-image" controls />
                                            )}
                                            <div className="message-content" dangerouslySetInnerHTML={markup(chat.message)}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="message">
                                        <img src={chatWith.ProfilePicture} alt="" className="circle" onClick={
                                            () => navigate(`/profile/${chatWith.Name}`, { replace: true })
                                        } />
                                        <div className="friend-chat-box">
                                            <div style={{ fontWeight: "bold" }}>{chatWith.Name}</div>
                                            {chat.image && (
                                                <img src={chat.image} alt="" className="chat-image" />
                                            )}
                                            {chat.video && (
                                                <video src={chat.video} className="chat-image" controls />
                                            )}
                                            {chat.audio && (
                                                <audio src={chat.audio} className="chat-image" controls />
                                            )}
                                            <div className="message-content" dangerouslySetInnerHTML={markup(chat.message)}></div>
                                        </div>
                                    </div>
                                )}
                                {file && (
                                    <UploadFileChat file={file} setFile={setFile} setMessage={setMessage} key={key} handleSendMessage={handleSendMessage} />
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="chat-input">
                    <div style={{ flex: "1" }}>
                        <RichText onContentChange={setMessage} key={key} />
                    </div>
                    <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handleChooseImage}>
                        <BsFillImageFill className="chat-send-icon" />
                    </button>
                    <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handleChooseVideo}>
                        <BiSolidVideoPlus className="chat-send-icon bigger" />
                    </button>
                    <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handleChooseVoice}>
                        <MdKeyboardVoice className="chat-send-icon bigger" />
                    </button>
                    <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handleSendMessage}>
                        <IoSend className="chat-send-icon" />
                    </button>
                </div>
            </div>
        )
    }
}