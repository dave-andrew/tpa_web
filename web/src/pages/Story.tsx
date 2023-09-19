import React, { useRef } from "react";
import "./Story.css";
import { AiFillPicture } from "react-icons/ai";
import { IoText } from "react-icons/io5";
import { useLazyQuery, useMutation } from "@apollo/client";
import { createStory } from "../apollo/storymutation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { AiOutlineCloseCircle } from "react-icons/ai"
import { useNavigate } from "react-router-dom";
import { createNotification } from "../apollo/notificationmutation";
import { getFriendUser } from "../apollo/friendquery";
import { useAuth } from "../context/AuthContext";

export default function Story() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [create_story] = useMutation(createStory);
    const [notif] = useMutation(createNotification);

    const [get_friend_user] = useLazyQuery(getFriendUser);

    const navigate = useNavigate();

    const handlePhotoStory = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const { user } = useAuth();

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const date = new Date();

        if (file) {
            const imageRef = ref(storage, `story/${file.name}+${date}`)
            uploadBytes(imageRef, file).then((data: any) => {
                const path = data.metadata.fullPath;
                const imgRef = ref(storage, path);
                getDownloadURL(imgRef)
                    .then((downloadURL: any) => {
                        create_story({
                            variables: {
                                storyurl: downloadURL
                            }
                        }).catch(err => {
                            console.log(err);
                            toast.error("There is an error posting the story")
                        }).then(async (data) => {
                            // console.log(data);

                            const allFriend = await get_friend_user();

                            const friendList = allFriend.data.getFriendUser.map((friend: any) => friend.ID);

                            friendList.map(async (friend: any) => {
                                await notif({
                                    variables: {
                                        userid: friend,
                                        message: `<p><b>${user.name}</b> has posted a new post!</p>`
                                    }
                                })
                            });

                            toast.success(data?.data.createStory);
                        })

                    })
                    .catch((error) => {
                        console.error('Error getting download URL:', error);
                    });
            })
        }
    };

    const handleTextStory = () => {
        navigate("/create-story/text", { replace: true })
    };

    const handleBackHome = () => {
        navigate("/", { replace: true });
    }

    return (
        <div>
            <div className="bg-story"></div>
            <AiOutlineCloseCircle className="close-btn" onClick={handleBackHome} />
            <input type="file" className="file-input" ref={fileInputRef} onChange={handleFileInputChange} />
            <div className="flex gap-10 choose-container">
                <div onClick={handlePhotoStory} className="photo-container">
                    <div className="circle pos">
                        <AiFillPicture className="centered" />
                    </div>
                    <div className="centered max-width text-center mt-10 bold size-15">Create a Photo Story</div>
                </div>
                <div onClick={handleTextStory} className="text-container">
                    <div className="circle pos">
                        <IoText className="centered" />
                    </div>
                    <div className="centered max-width text-center mt-10 bold size-15">Create a Text Story</div>
                </div>
            </div>
        </div>
    );
}
