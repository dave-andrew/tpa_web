import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./CreateGroup.css"
import { useAuth } from "../context/AuthContext";
import { BiDesktop, BiMobile } from "react-icons/bi";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { createGroup } from "../apollo/groupmutation";
import { createGroupChat } from "../apollo/chatmutation";


export default function CreateGroup() {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [create_group] = useMutation(createGroup);
    const [create_group_chat] = useMutation(createGroupChat);

    const [groupName, setGroupName] = useState<string>("")
    const [groupPrivacy, setGroupPrivacy] = useState<string>("Group Privacy")

    const handleBack = () => {
        navigate("/group", { replace: true });
    }

    const handleCreateGroup = () => {
        if(groupName === ""){
            toast.error("Group name cannot be empty")
            return;
        } else if(groupPrivacy === "Group Privacy"){
            toast.error("Please choose group privacy")
            return;
        }

        create_group({
            variables: {
                name: groupName,
                visibility: groupPrivacy,
                members: []
            }
        }).then(data => {
            if(data.data.createGroup.ID){
                create_group_chat({
                    variables: {
                        groupid: data.data.createGroup.ID,
                        users: []
                    }
                }).then(_ => {
                    toast.success("Group created successfully")
                    navigate("/group", { replace: true })
                }).catch(err => {
                    console.log(err)
                })  
            }
        })

    }

    return (
        <div>
            <AiOutlineCloseCircle className="reel-close-btn" onClick={handleBack} />
            <div className="create-group-grid">
                <div className="group-left-grid">
                    <hr className="mt-80" />
                    <div className="ml-20 mr-20">
                        <div className="reel-header">Create group</div>
                        <div className="group-owner">
                            <img src={user.profile} alt="" className="circle" />
                            <div className="flex flex-col justify-center">
                                <div style={{ fontWeight: "bold" }}>{user.name}</div>
                                <div style={{ fontSize: "10px" }}>Admin</div>
                            </div>
                        </div>
                        <input type="text" className="group-input" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                        <select name="" id="" className="group-input-select" value={groupPrivacy} onChange={(e) => setGroupPrivacy(e.target.value)}>
                            <option value="Group Privacy">Choose Privacy</option>
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                        <input type="text" className="group-input" placeholder="Invite Friends (optional)" />
                    </div>
                    <button className="create-reel-btn" onClick={handleCreateGroup}>Create Group</button>
                </div>
                <div className="group-content">
                    <div className="group-preview">
                        <div className="group-preview-header">
                            <div className="bold font-16">Desktop Preview</div>
                            <div>
                                <BiDesktop className="device-icon" />
                                <BiMobile className="device-icon" />
                            </div>
                        </div>
                        <div className="group-layout">
                            <img src="https://picsum.photos/seed/picsum/200/300" alt="" className="img-layout" />
                            <div className="mt-10 ml-20">
                                {groupName && (
                                    <div className="name-layout">{groupName}</div>
                                )}
                                {groupName === "" && (
                                    <div className="name-layout">Group Name</div>
                                )}
                                <div className="flex">
                                    <div className="status-layout">{groupPrivacy}</div>
                                    <div>・</div>
                                    <div>1 member</div>
                                </div>
                                <hr className="mt-10 mb-0" />
                                <div className="flex items-center">
                                    <div className="layout-menu">About</div>
                                    <div className="layout-menu">Post</div>
                                    <div className="layout-menu">Members</div>
                                    <div className="layout-menu">Events</div>
                                </div>
                            </div>
                            <div className="content-layout">
                                <div className="inner-layout">
                                    <div className="left-layout">
                                        <div className="layout-create-post">
                                            <div className="pic-layout"></div>
                                            <input type="text" className="input-layout" disabled placeholder="What's on your mind?" />
                                        </div>
                                    </div>
                                    <div className="right-layout">
                                        <div className="about-layout">
                                            About
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}