import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import LoggedNavBar from "../component/LoggedNavBar";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";
import { useRef, ChangeEvent, useState, useEffect } from "react";
import { storage } from "../firebase/firebaseConfig";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { change_home_picture, change_profile_picture } from "../apollo/mutation";
import { toast } from "react-toastify"
import FriendRecommend from "../component/FriendRecommend";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByName } from "../apollo/query";
import { countFriend, getFriendStatus } from "../apollo/friendquery";
import { acceptFriend, addFriend, removeFriend } from "../apollo/friendmutation";
import { FaCakeCandles } from "react-icons/fa6";
import { createChat } from "../apollo/chatmutation";
import { checkChat } from "../apollo/chatquery";
import UserPost from "../component/UserPost";
import UserFriend from "../component/UserFriend";
import { getBlockStatus } from "../apollo/notificationquery";
import { blockUser, unblockUser } from "../apollo/notificationmutation";
import { IoIosNotifications, IoIosNotificationsOff } from "react-icons/io";
import ProfileEdit from "../component/ProfileEdit";
import UserReel from "../component/UserReel";


function formatDate(inputDate: string) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(inputDate).toLocaleDateString(undefined, options);
    return formattedDate;
}


export default function Profile() {
    const { user, setUser } = useAuth();
    const { username } = useParams();
    const navigate = useNavigate();

    const [chooseNav, setChooseNav] = useState<string>("Post");

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const profileInputRef = useRef<HTMLInputElement | null>(null);

    const [imageURL, setImageURL] = useState<string>("");
    const [profileURL, setProfileURL] = useState<string>("");

    const [friendStatus, setFriendStatus] = useState<string>("");

    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState("");
    const [friendCount, setFriendCount] = useState(0);

    const [changeHomePicture] = useMutation(change_home_picture)
    const [changeProfilePicture] = useMutation(change_profile_picture);
    const [create_chat] = useMutation(createChat);
    const [block_notif] = useMutation(blockUser);
    const [unblock_notif] = useMutation(unblockUser);
    const [toggleEdit, setToggleEdit] = useState<boolean>(false);

    const [check_chat] = useLazyQuery(checkChat);

    const { loading, data, error } = useQuery(getUserByName, {
        variables: {
            name: username
        }
    });

    const { } = useQuery(countFriend, {
        onCompleted: (data) => {
            setFriendCount(data?.countFriend)
        }
    })

    if (error) {
        navigate("/", { replace: true });
    }

    const [get_friend_status] = useLazyQuery(getFriendStatus);
    const [accept_friend] = useMutation(acceptFriend);
    const [add_friend] = useMutation(addFriend);
    const [remove_friend] = useMutation(removeFriend)

    const [blockStatus, setBlockStatus] = useState<boolean>(false);

    const { } = useQuery(getBlockStatus, {
        variables: {
            userid: data?.getUserByName.ID
        }, onCompleted: (data) => {
            setBlockStatus(data?.getBlockStatus)
        }
    })

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const date = new Date();

        if (file) {
            if (user.home) {
                const lastImgRef = ref(storage, user.home);
                deleteObject(lastImgRef).catch((err) => {
                    console.log(err);
                })
            }
            const imageRef = ref(storage, `user/home/${file.name}+${date}`)
            uploadBytes(imageRef, file).then((data) => {
                const path = data.metadata.fullPath;
                const imgRef = ref(storage, path);
                getDownloadURL(imgRef)
                    .then((downloadURL: any) => {
                        setImageURL(downloadURL);
                        setUser((prevUser: any) => ({
                            ...prevUser,
                            home: downloadURL,
                        }));
                        changeHomePicture({
                            variables: {
                                url: downloadURL
                            }
                        }).catch((error) => {
                            console.log(error);
                        }).then((data) => {
                            toast.success(data?.data?.addHomePicture);
                        });
                    })
                    .catch((error) => {
                        console.error('Error getting download URL:', error);
                    });
            }).catch(err => {
                console.log(err);
            })
        }
    };

    // console.log(friendStatus)

    useEffect(() => {
        setImageURL(data?.getUserByName.HomePicture);
        setProfileURL(data?.getUserByName.ProfilePicture);
        if (data) {
            // console.log(data.getUserByName.ID);
            get_friend_status({
                variables: {
                    friendid: data.getUserByName.ID
                }
            }).then(data => {
                console.log(data);
                setFriendStatus(data.data.getStatus.Status.toString());
                setReceiver(data.data.getStatus.Friend.Name);
                setSender(data.data.getStatus.User.Name);
                // console.log(data.data.getStatus);
            }).catch(_ => {
                // console.log(err);
                setFriendStatus("null");
            });
        }
    }, [data]);

    const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const date = new Date();

        if (file) {
            if (user.profile) {
                const lastImgRef = ref(storage, user.profile);
                deleteObject(lastImgRef).catch((err: any) => {
                    console.log(err);
                })
            }

            const imageRef = ref(storage, `user/profile/${file.name}+${date}`)
            uploadBytes(imageRef, file).then((data: any) => {
                const path = data.metadata.fullPath;
                const imgRef = ref(storage, path);
                getDownloadURL(imgRef)
                    .then((downloadURL: any) => {
                        setProfileURL(downloadURL);
                        setUser((prevUser: any) => ({
                            ...prevUser,
                            profile: downloadURL,
                        }));
                        changeProfilePicture({
                            variables: {
                                url: downloadURL
                            }
                        }).catch((error) => {
                            console.log(error);
                        }).then((data) => {
                            toast.success(data?.data?.addProfilePicture)
                        })
                    })
                    .catch((error) => {
                        console.error('Error getting download URL:', error);
                    });
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const handleHomeInput = () => {
        fileInputRef?.current?.click();
    };

    const handleProfileInput = () => {
        profileInputRef?.current?.click();
    }

    const handleBlockNotif = () => {
        block_notif({
            variables: {
                userid: data?.getUserByName.ID
            }
        }).then(() => {
            setBlockStatus(true);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleUnblockNotif = () => {
        unblock_notif({
            variables: {
                userid: data?.getUserByName.ID
            }
        }).then(() => {
            setBlockStatus(false);
        }).catch(err => {
            console.log(err);
        })
    }

    if (loading) {
        return <div>Loading...</div>
    }

    const handleAddFriend = () => {
        add_friend({
            variables: {
                friendid: data?.getUserByName.ID
            }
        }).then(data => {
            setFriendStatus(data.data.addFriend.Status.toString());
            // console.log(data.data.addFriend.Status.toString())
        }).catch(err => {
            console.log(err);
        });
    }

    const handleAcceptFriend = () => {
        accept_friend({
            variables: {
                friendid: data?.getUserByName.ID
            }
        }).then(data => {
            setFriendStatus(data.data.acceptFriend.Status.toString());
        }).catch(err => {
            console.log(err);
        });
    }

    const handleRemoveFriend = () => {
        remove_friend({
            variables: {
                friendid: data?.getUserByName.ID
            }
        }).catch(err => {
            console.log(err);
        }).then(() => {
            setFriendStatus("null");
        });
    }

    const handleNavigateChat = () => {
        check_chat({
            variables: {
                userid: data?.getUserByName.ID
            }
        }).then((response) => {
            const chatData = response?.data?.checkChat;
            if (chatData) {
                navigate("/chat/" + chatData.ID, { replace: true });
            } else {
                // console.log("No existing chat found.");
                create_chat({
                    variables: {
                        userid: data?.getUserByName.ID
                    }
                }).then(resp => {
                    console.log(resp);
                    navigate("/chat/" + resp?.data?.createChat.ID, { replace: true });
                }).catch(err => {
                    console.log(err);
                });
            }
        }).catch((error) => {
            console.error("Error checking chat:", error);
        });
    }

    const handleEditProfile = () => {
        setToggleEdit(!toggleEdit);
    }

    // console.log(data?.getUserByName.DOB)

    const date = new Date(data?.getUserByName.DOB);
    const format = formatDate(date.toString());

    return (
        <div className="mb-20">
            <nav>
                <LoggedNavBar />
            </nav>
            <main className="grid">
                <div style={{ marginTop: "55px" }}></div>
                <div style={{ marginTop: "55px" }}></div>
                <div style={{ marginTop: "55px" }}></div>
            </main>
            {username === user.name && (
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    <input
                        type="file"
                        ref={profileInputRef}
                        style={{ display: "none" }}
                        onChange={handleProfileChange}
                    />
                </div>
            )}
            {!imageURL && (
                <div className="default-container" onClick={handleHomeInput}>
                    .
                </div>
            )}
            {imageURL && (
                <div>
                    <img src={imageURL} alt="" className="home-container" onClick={handleHomeInput} />
                </div>
            )}

            <div className="width-1100 mg-auto flex gap-5" onClick={handleProfileInput}>
                <img src={profileURL} alt="" className="profile-container ml-80" />
                <div>
                    <div className="flex items-center" style={{ gap: "20px" }}>
                        <div className="name">{data?.getUserByName.Name}</div>
                        <div className="bold" style={{ fontSize: "15px" }}>({data?.getUserByName.Surname})</div>
                    </div>
                    <div className="ml-10">{friendCount} friends</div>
                    <div className="flex gap-5 ml-10 mt-10 bold"><FaCakeCandles />{format}</div>
                </div>
                {!(username === user.name) && (
                    <div className="send-message-btn" onClick={handleNavigateChat}>
                        Send Message
                    </div>
                )}
            </div>
            {username === user.name && (
                <div className="add-friend" onClick={handleEditProfile}>Edit Profile</div>
            )}
            {(!(username === user.name) && friendStatus === "null") && (
                <div className="add-friend" onClick={handleAddFriend}>Add Friend</div>
            )}

            {(!(username === user.name) && friendStatus === "false" && user.name === receiver) && (
                <div className="add-friend" onClick={handleAcceptFriend}>Accept Friend Request</div>
            )}

            {(!(username === user.name) && friendStatus === "false" && user.name === sender) && (
                <div className="add-friend">Pending Friend Request</div>
            )}

            {(!(username === user.name) && friendStatus === "true") && (
                <div className="add-friend" onClick={handleRemoveFriend}>Remove Friend</div>
            )}

            {(!(username === user.name) && blockStatus) && (
                <div className="profile-notif-container" onClick={handleUnblockNotif}><IoIosNotificationsOff className="profile-notif-icon" /></div>
            )}

            {(!(username === user.name) && !blockStatus) && (
                <div className="profile-notif-container" onClick={handleBlockNotif}><IoIosNotifications className="profile-notif-icon" /></div>
            )}

            <div className="mt-20 mb-20">
                <FriendRecommend />
            </div>

            <div className="profile-nav">
                <div className="profile-nav-item" onClick={() => setChooseNav("Post")}>Posts</div>
                <div className="profile-nav-item" onClick={() => setChooseNav("Friend")}>Friends</div>
                <div className="profile-nav-item" onClick={() => setChooseNav("Reel")}>Reels</div>
            </div>
            <hr style={{ width: "70vw", margin: "0 auto" }} />
            <div className="profile-content-container">
                {chooseNav === "Post" && (
                    <UserPost userid={data?.getUserByName.ID} />
                )}
                {chooseNav === "Friend" && (
                    <UserFriend userid={data?.getUserByName.ID} />
                )}
                {chooseNav === "Reel" && (
                    <UserReel userid={data?.getUserByName.ID} />
                )}
            </div>
            {toggleEdit && (
                <ProfileEdit handleToggleEdit={handleEditProfile} />
            )}
        </div>
    );
}
