import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom"
import { checkGroupRequest, checkUserRole, getGroup } from "../apollo/groupquery";
import { useState, useRef } from "react";
import LoggedNavBar from "../component/LoggedNavBar";
import GroupSidebar from "../component/GroupSidebar";
import "./Group.css"
import Discussion from "../component/for-profile/Discussion";
import Files from "../component/for-profile/Files";
import Members from "../component/for-profile/Members";
import { inviteGroup, requestGroup, updateGroupImage } from "../apollo/groupmutation";
import FriendListModal from "../component/FriendListModal";
import { toast } from "react-toastify";
import { createNotification } from "../apollo/notificationmutation";
import { useAuth } from "../context/AuthContext";
import Request from "../component/for-profile/Request";
import { leaveGroupAdmin, leaveGroupMember } from "../apollo/groupmember";
import { BsFillChatDotsFill } from "react-icons/bs";
import { getGroupChat } from "../apollo/chatquery";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";


export default function GroupProfile() {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const imageRef = useRef<any>();

    const [group, setGroup] = useState<any>(null);
    const [menu, setMenu] = useState<string>("Discussion");
    const [toggleFriend, setToggleFriend] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string>("");
    const [chosenFriend, setChosenFriend] = useState<any[]>([])
    const [pending, setPending] = useState<string>("");
    // console.log(chosenFriend);

    const [invite_group] = useMutation(inviteGroup);
    const [request_group] = useMutation(requestGroup);
    const [notif] = useMutation(createNotification);
    const [leave_group_member] = useMutation(leaveGroupMember);
    const [leave_group_admin] = useMutation(leaveGroupAdmin);
    const [update_group_image] = useMutation(updateGroupImage);

    const [get_group_chat] = useLazyQuery(getGroupChat);

    const { } = useQuery(checkGroupRequest, {
        variables: {
            groupid: id
        },
        onCompleted: (data) => {
            console.log(data);
            setPending(data?.checkGroupRequest)
        }
    })

    const { } = useQuery(checkUserRole, {
        variables: {
            groupid: id
        },
        onCompleted: (data) => {
            console.log(data)
            setUserRole(data?.checkUserRole)
        }
    })

    const execute = () => {
        if (chosenFriend.length > 0) {
            chosenFriend.map((friendId: any) => {
                invite_group({
                    variables: {
                        groupid: id,
                        receiverid: friendId
                    }
                }).then(() => {
                    notif({
                        variables: {
                            userid: friendId,
                            message: `<p><b>${user.name}</b> have invited you to join a group!</p>`,
                        }
                    }).then(() => {
                        toast.success("Invitation sent!");
                        handleToggleFriend();
                    })
                })
            })
        } else {
            toast.error("Please choose at least one friend to invite!");
        }
    }

    // console.log(group)

    const { loading, error } = useQuery(getGroup, {
        variables: {
            id: id
        }, onCompleted: (data) => {
            // console.log(data);
            setGroup(data?.getGroup)
        }
    })

    const handleToggleFriend = async () => {
        setToggleFriend(!toggleFriend)
    }

    const handleRequestGroup = () => {
        request_group({
            variables: {
                groupid: id
            }
        }).then(() => {
            const notifPromises = group.Admins.map((admin: any) => {
                return notif({
                    variables: {
                        userid: admin.ID,
                        message: `<p><b>${user.name}</b> have requested to join your group!</p>`,
                    }
                });
            });

            Promise.all(notifPromises)
                .then(() => {
                    toast.success("Request sent!");
                    setPending("pending");
                })
                .catch((error) => {
                    console.error("Error sending notifications:", error);
                });
        });
    }

    const handleLeaveGroupMember = () => {
        leave_group_member({
            variables: {
                groupid: id
            }
        }).then(() => {
            toast.success("Left group!");
            navigate("/group", { replace: true })
        })
    }

    const handleLeaveGroupAdmin = () => {
        leave_group_admin({
            variables: {
                groupid: id
            }
        }).then((data) => {
            if (data.data.leaveGroupAdmin === "You can't leave the group because you are the only admin!") {
                toast.error("You can't leave the group because you are the only admin!");
                return;
            }
            toast.success("Left group!");
            navigate("/group", { replace: true })
        })
    }

    const handleChat = () => {
        get_group_chat({
            variables: {
                groupid: id
            }
        }).then(data => {
            // console.log(data);
            navigate("/chat/" + data.data.getGroupChat.ID, { replace: true });
        })
    }

    const handleInputImage = () => {
        if(userRole === "admin") {
            imageRef.current.click();
        }
    }

    const handleGroupImage = async () => {
        const image = await uploadBytes(ref(storage, `group/${id}`), imageRef.current.files[0])
        await getDownloadURL(image.ref).then(url => {
            update_group_image({
                variables: {
                    id: id,
                    image: url
                }
            }).then(() => {
                setGroup((prevGroup: any) => ({
                    ...prevGroup,
                    ImageURL: url
                }));
                toast.success("Image updated!")
            }).catch(err => {
                console.log(err)
            })
        })
    }


    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (error) {
        navigate("/group", { replace: true })
    }
    // console.log(group)

    return (
        <div>
            <input type="file" ref={imageRef} accept="image/*" onChange={handleGroupImage} style={{display: "none"}} />
            <LoggedNavBar />
            <div className="group-grid">
                <GroupSidebar />
                <div className="group-profile">
                    <img src={group?.ImageURL} alt="" className="group-home-picture" onClick={handleInputImage} />
                    <div className="group-profile-header">
                        <div className="flex items-center gap-5">
                            <div className="group-profile-name">{group?.Name}</div>
                            <div>({group?.Visibility})</div>
                        </div>
                        <div className="flex gap-5">
                            {(userRole === "admin" || userRole === "member") && (
                                <button className="group-invite-btn" onClick={handleChat}><BsFillChatDotsFill /></button>
                            )}
                            {(userRole === "admin" || userRole === "member") && (
                                <button className="group-invite-btn" onClick={handleToggleFriend}>+ Invite</button>
                            )}
                            {userRole === "member" && (
                                <button className="group-leave-btn" onClick={handleLeaveGroupMember}>Leave</button>
                            )}
                            {userRole === "admin" && (
                                <button className="group-leave-btn" onClick={handleLeaveGroupAdmin}>Leave</button>
                            )}
                        </div>
                        {pending === "pending" && (
                            <button className="group-invite-btn" style={{ backgroundColor: "lightgray" }} disabled={true}>Pending</button>
                        )}
                        {(userRole === "none" && pending !== "pending") && (
                            <button className="group-invite-btn" onClick={handleRequestGroup}>Join Group</button>
                        )}
                    </div>
                    <hr style={{ marginTop: "10px", marginBottom: "0px" }} />
                    <div className="flex">
                        <div className="group-profile-menu" onClick={() => setMenu("Discussion")}>Discussion</div>
                        <div className="group-profile-menu" onClick={() => setMenu("Members")}>Members</div>
                        <div className="group-profile-menu" onClick={() => setMenu("Files")}>Files</div>
                        {userRole === "admin" && <div className="group-profile-menu" onClick={() => setMenu("Request")}>Request</div>}
                    </div>
                    <div className="group-profile-content">
                        {menu === "Discussion" && <Discussion group={group} />}
                        {menu === "Members" && <Members group={group} userRole={userRole} />}
                        {menu === "Files" && <Files group={group} />}
                        {menu === "Request" && <Request group={group} />}
                    </div>
                </div>
            </div>
            {toggleFriend && (
                <FriendListModal handleToggleFriend={handleToggleFriend} chosenFriend={chosenFriend} setChosenFriend={setChosenFriend} execute={execute} />
            )}
        </div>
    );
}