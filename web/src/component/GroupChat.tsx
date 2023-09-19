import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { db, storage } from "../firebase/firebaseConfig";
import { Timestamp, addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import RichText from "./RichText";
import { BsFillImageFill } from "react-icons/bs";
import { BiSolidVideoPlus } from "react-icons/bi";
import { MdKeyboardVoice } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import UploadFileChat from "./UploadFileChat";
import { ReactMediaRecorder } from "react-media-recorder";
import ChatPost from "./ChatPost";


export default function GroupChat({ chatData }: any) {



    // console.log(chatData);

    const { user } = useAuth();
    const navigate = useNavigate();

    const [message, setMessage] = useState<any>();
    const [key, setKey] = useState<number>(0);

    const [chat, setChat] = useState<any[]>([]);

    const [isRecording, setIsRecording] = useState<boolean>(false);

    const group = chatData.Group;
    const users = chatData.Users;

    console.log(users);

    const videoRef = useRef<HTMLInputElement | null>(null);
    const audioRef = useRef<HTMLInputElement | null>(null);
    const imageRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const getChat = async () => {
            try {
                const chatCollection = collection(db, `${chatData.ID}`);

                const querySnap = await query(chatCollection, orderBy("CreatedAt"));

                const unsubscribe = onSnapshot(querySnap, (querySnapshot: any) => {
                    const chats = querySnapshot.docs.map((doc: any) => ({
                        ...doc.data(),
                        id: doc.id,
                        ref: doc.ref,
                    }));
                    setChat(chats);
                    console.log("Chat data:", chatData);
                });
                return () => {
                    unsubscribe();
                };
            } catch (error) {
                console.error("Error fetching chat data:", error);
            }
        };

        if (chatData && user) {
            getChat();
        }
    }, [chatData, user]);

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

    const handleChangeFile = (e: any) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSendMessage = async () => {
        if (chatData.ID) {
            try {
                if (!message && !file) {
                    toast.error("Please enter a message or upload a file")
                    return;
                }

                const messageData: any = {
                    userid: user.id,
                    message: message || "",
                    CreatedAt: Timestamp.fromDate(new Date()),
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
                    // console.log("TESTING DISINI")
                    const chatCollection = collection(db, `${chatData.ID}`);
                    await addDoc(chatCollection, messageData);

                } catch (err) {
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

    const handleSendAudio = async (mediaBlobUrl: any) => {
        console.log(mediaBlobUrl)
        try {
            if (mediaBlobUrl && mediaBlobUrl !== undefined) {
                const audioBlob = await fetch(mediaBlobUrl).then((res) => res.blob());
                const messageData: any = {
                    userid: user.id,
                    message: message || "",
                    CreatedAt: Timestamp.fromDate(new Date()),
                };

                const fileName = `${user.id}-${new Date().toISOString()}.wav`;
                const storageRef = ref(storage, `chat/${user.id}/${fileName}+${new Date()}`);
                await uploadBytes(storageRef, audioBlob);

                const url = await getDownloadURL(storageRef);

                messageData.audio = url;

                const chatCollection = collection(db, `${chatData.ID}`);
                await addDoc(chatCollection, messageData);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="chat-box">
            <input type="file" accept="image/*" ref={imageRef} className="disappear-input" onChange={handleChangeFile} />
            <input type="file" accept="video/*" ref={videoRef} className="disappear-input" onChange={handleChangeFile} />
            <input type="file" accept="audio/*" ref={audioRef} className="disappear-input" onChange={handleChangeFile} />
            <div className="header">
                <img src={group.ImageURL} alt="" className="circle" />
                <div style={{ fontWeight: "bold" }}>{group.Name}</div>
            </div>
            <hr />
            <div className="conversation">
                {
                    chat.map((data: any) => {
                        if (data.userid === user.id) {
                            return (
                                <div className="user-message">
                                    <img src={user.profile} alt="" className="circle" />
                                    <div className="user-chat-box">
                                        <div style={{ fontWeight: "bold" }}>Me</div>
                                        {data.image && (
                                            <img src={data.image} alt="" className="chat-image" />
                                        )}
                                        {data.video && (
                                            <video src={data.video} className="chat-image" controls />
                                        )}
                                        {data.audio && (
                                            <audio src={data.audio} className="chat-image" controls />
                                        )}
                                        {data.post && (
                                            <ChatPost postid={data.post} />
                                        )}
                                        <div className="message-content" dangerouslySetInnerHTML={markup(data.message)}></div>
                                    </div>
                                </div>
                            )
                        } else {
                            const chatWith = users.find((user: any) => user.ID === data.userid);
                            if (chatWith) {
                                return (
                                    <div className="message" key={chatWith.ID}>
                                        <img src={chatWith.ProfilePicture} alt="" className="circle" onClick={
                                            () => navigate(`/profile/${chatWith.Name}`, { replace: true })
                                        } />
                                        <div className="friend-chat-box">
                                            <div style={{ fontWeight: "bold" }}>{chatWith.Name}</div>
                                            {data.image && (
                                                <img src={data.image} alt="" className="chat-image" />
                                            )}
                                            {data.video && (
                                                <video src={data.video} className="chat-image" controls />
                                            )}
                                            {data.audio && (
                                                <audio src={data.audio} className="chat-image" controls />
                                            )}
                                            {data.post && (
                                                <ChatPost postid={data.post} />
                                            )}
                                            <div className="message-content" dangerouslySetInnerHTML={markup(data.message)}></div>
                                        </div>
                                    </div>
                                )
                            }
                        }
                    })
                }
                {file && (
                    <UploadFileChat file={file} setFile={setFile} setMessage={setMessage} key={key} handleSendMessage={handleSendMessage} />
                )}
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
                <ReactMediaRecorder
                    audio
                    render={({ status, startRecording, stopRecording, mediaBlobUrl }: any) => (
                        <div>

                            {!isRecording && (
                                <button style={{ border: "none", backgroundColor: "transparent" }} onClick={() => {
                                    startRecording();
                                    setIsRecording(true);
                                }}>
                                    <MdKeyboardVoice className="chat-send-icon bigger" />
                                </button>
                            )}
                            {isRecording && (
                                <button style={{ border: "none", backgroundColor: "transparent", color: "red" }} onClick={() => {
                                    stopRecording();
                                    setIsRecording(false);

                                }}>
                                    <MdKeyboardVoice className="chat-send-icon bigger" />
                                </button>
                            )}
                        </div>
                    )}
                    onStop={(blobUrl: any) => {
                        handleSendAudio(blobUrl);
                    }}
                />
                <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handleSendMessage}>
                    <IoSend className="chat-send-icon" />
                </button>
            </div>
        </div>
    )
}