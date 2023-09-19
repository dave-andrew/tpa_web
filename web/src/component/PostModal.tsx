import React, { useRef, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io"
import { useAuth } from "../context/AuthContext"
import { BsGlobeAmericas } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { AiFillFileImage } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx"
import "./CommentModal.css"
import "./PostModal.css"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { useLazyQuery, useMutation } from "@apollo/client";
import { createPost } from "../apollo/postmutation";
import { toast } from "react-toastify"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import RichText from "./RichText";
import { getFriendUser } from "../apollo/friendquery";
import { createNotification } from "../apollo/notificationmutation";

export default function PostModal({ handleInputActive }: any) {

    const { user } = useAuth();

    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const gifInputRef = useRef<HTMLInputElement | null>(null);
    const pdfInputRef = useRef<HTMLInputElement | null>(null);

    const [visibility, setVisibility] = useState("Public");
    const [image, setImage] = useState<File[]>([]);
    const [description, setDescription] = useState("");

    console.log(image)

    const [key, setKey] = useState(0);

    const [create_post] = useMutation(createPost);
    const [notif] = useMutation(createNotification);

    const [get_all_friend] = useLazyQuery(getFriendUser);

    const handleImageClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    }

    const handleGIFClick = () => {
        if (gifInputRef.current) {
            gifInputRef.current.click();
        }
    }

    const handlePDFClick = () => {
        if (pdfInputRef.current) {
            pdfInputRef.current.click();
        }
    }

    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).filter(file => !image.some(existingFile => existingFile.name === file.name));
            setImage([...image, ...newImages]);
        }
    };
    

    const handleRemoveImage = (index: number) => {
        const newImage = [...image];
        newImage.splice(index, 1);
        setImage(newImage);
    }

    const formatFileSize = (bytes: number) => {
        const megabytes = bytes / (1024 * 1024);
        return megabytes.toFixed(2) + " MB";
    }

    const handleCreatePost = async () => {
        if(!description){
            toast.error("Please enter a description!");
            return;
        }
        try {
            const uploadPromises = image.map(async (img: any) => {
                const date = new Date();
                const imageRef = ref(storage, `post/${img.name}+${date}`);
                await uploadBytes(imageRef, img);
                const path = imageRef.fullPath;
                const imgRef = ref(storage, path);
                const downloadURL = await getDownloadURL(imgRef);
                return downloadURL;
            });
    
            const imageUrls = await Promise.all(uploadPromises);
    
            const newPost = {
                ImageURL: imageUrls,
                Description: description,
                Visibility: visibility
            };
    
            await create_post({
                variables: {
                    newPost: newPost
                }
            });

            const allFriend = await get_all_friend()

            const friendList = allFriend.data.getFriendUser.map((friend: any) => friend.ID);

            friendList.map(async (friend: any) => {
                await notif({
                    variables: {
                        userid: friend,
                        message: `<p><b>${user.name}</b> has posted a new post!</p>`
                    }
                })
            });

            setImage([]);
            setDescription("");
            setVisibility("Public");
            toast.success("Post posted!");
            setKey(key+1);
            handleInputActive();
        } catch (error) {
            console.error(error);
            toast.error("Post error!");
        }
    };
    

    let icon;

    if (visibility === "Public") {
        icon = <BsGlobeAmericas />;
    } else if (visibility === "Private") {
        icon = <BsFillEyeSlashFill />;
    } else if (visibility === "Friend Only") {
        icon = <FaUserFriends />;
    }

    console.log(description);

    return (
        <div className="modal">
            <input multiple type="file" style={{ display: "none" }} ref={imageInputRef} onChange={handleAddImage} accept="image/*" />
            <input multiple type="file" style={{ display: "none" }} ref={gifInputRef} onChange={handleAddImage} accept="image/gif" />
            <input multiple type="file" style={{ display: "none" }} ref={pdfInputRef} onChange={handleAddImage} accept="application/pdf" />
            <div className="black-bg"></div>
            <IoIosCloseCircleOutline className="close-button" onClick={handleInputActive} />
            <div className="modal-content">
                <div className="flex justify-center items-center size-20 bold p-20">
                    Create Post
                </div>
                <hr style={{ marginBottom: "0px" }} />
                <div className="p-50">
                    <div className="flex mb-20">
                        <img src={user.profile} alt="" className="circle" />
                        <div className="flex flex-col">
                            <div className="bold">{user.name}</div>
                            <div className="flex">
                                {icon}
                                <select className="visibility-choose" onChange={(e) => setVisibility(e.target.value)} >
                                    <option value="Public">Public</option>
                                    <option value="Private">Private</option>
                                    <option value="Friend Only">Friend Only</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <RichText onContentChange={setDescription} key={key} />
                    <div className="attach-container mt-20">
                        <div>Add to your post</div>
                        <div className="flex div-gap">
                            <div onClick={handleImageClick}>Image</div>
                            <div onClick={handleGIFClick}>GIF</div>
                            <div onClick={handlePDFClick}>PDF</div>
                        </div>
                    </div>
                    <div className="file-display">
                        {image.map((file, index) => (
                            <div className="file-container">
                                <div className="flex items-center">
                                    <AiFillFileImage className="image-icon" />
                                    <div className="flex flex-col">
                                        <div>{file.name}</div>
                                        <div className="size-info">{formatFileSize(file.size)}</div>
                                    </div>
                                </div>
                                <RxCross2 className="x-icon" onClick={() => handleRemoveImage(index)} />
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex justify-end">
                        <button className="create-post-btn" onClick={handleCreatePost}>Create Post</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
