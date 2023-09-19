import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useRef } from "react";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { createStory } from "../apollo/storymutation";
import { toast } from "react-toastify";
import { getFriendUser } from "../apollo/friendquery";
import { createNotification } from "../apollo/notificationmutation";
import { useAuth } from "../context/AuthContext";

export default function TextStory() {
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [color, setColor] = useState("");
    const [font, setFont] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [create_story] = useMutation(createStory);
    const [notif] = useMutation(createNotification);
    const [get_friend_user] = useLazyQuery(getFriendUser);
    const { user } = useAuth();

    const handleBack = () => {
        navigate("/create-story", { replace: true });
    };

    const handleStoryTemplateClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleCreateStory = () => {
        create_story({
            variables: {
                font: font,
                color: color,
                text: text,
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
                        message: `<p><b>${user.name}</b> uploaded a new story!</p>`
                    }
                })
            });

            toast.success(data?.data.createStory);
            navigate("/", { replace: true });
        })
    }

    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={handleInputChange}
                className="hidden-input"
                maxLength={300}
            />
            <div className="bg-story"></div>
            <div className="text-story-grid">
                <div className="bg-element">
                    <IoChevronBackCircleOutline className="back-icon" onClick={handleBack} />
                    <div className="mt-50">
                        <div>Color: (ex: #000000)</div>
                        <input type="text" className="element-input" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setColor(e.target.value)
                        }} value={color} />
                    </div>
                    <div className="mt-30">
                        <div>Font:</div>
                        <select className="font-select" style={{ fontFamily: `${font}` }} onChange={(e) => setFont(e.target.value)}>
                            <option value="Inter" className="font-option" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</option>
                            <option value="Arial, sans-serif" className="font-option" style={{ fontFamily: 'Arial, sans-serif' }}>Arial</option>
                            <option value="Times New Roman" className="font-option" style={{ fontFamily: 'Times New Roman, serif' }}>Times New Roman</option>
                        </select>
                    </div>
                    <button className="create-story-btn" onClick={handleCreateStory}>Create Story</button>
                </div>
                <div className="bg-editor">
                    <div className="story-template" onClick={handleStoryTemplateClick} style={{ backgroundColor: `${color}` }}>
                        <p className="story-text" style={{ fontFamily: `${font}` }}>{text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
