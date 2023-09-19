import LoggedNavBar from "../component/LoggedNavBar";
import { FaBookOpen } from "react-icons/fa"
import { BiSolidVideo } from "react-icons/bi"
import "./Home.css"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PostContainer from "../component/PostContainer";
import PostModal from "../component/PostModal";
import { useLazyQuery } from "@apollo/client";
import { getAllFriend } from "../apollo/friendquery";
import { checkStory } from "../apollo/storyquery";
import StoryDisplay from "../component/StoryDisplay";
import { BiSolidUserCircle } from "react-icons/bi"
import { FaUserFriends } from "react-icons/fa"
import { HiUserGroup } from "react-icons/hi"
import { BsFillChatFill } from "react-icons/bs"
import HomeStory from "../component/HomeStory";
import HomeReel from "../component/HomeReel";

export default function Home() {

    const [friendStory, setFriendStory] = useState<any[]>([]);

    const { user } = useAuth();
    const navigate = useNavigate();

    const [isActive, setIsActive] = useState(false);

    const [get_all_friend] = useLazyQuery(getAllFriend);
    const [check_story] = useLazyQuery(checkStory);

    const [chooseSR, setChooseSR] = useState<boolean>(true);
    const [storyIndex, setStoryIndex] = useState<number>(0);

    const handleProfile = () => {
        navigate(`/profile/${user.name}`, { replace: true });
    }

    const handleFriend = () => {
        navigate(`/friends`, { replace: true });
    }

    const handleInputActive = () => {
        setIsActive(!isActive);
    }

    const [toggleStory, setToggleStory] = useState(false);

    const handleViewStory = () => {
        setToggleStory(!toggleStory);
    }

    const handleReels = () => {
        navigate("/reels", { replace: true });
    }

    const handleChat = () => {
        navigate("/chat", { replace: true });
    }

    const handleGroup = () => {
        navigate("/group", { replace: true });
    }

    useEffect(() => {
        if (user) {
            get_all_friend()
                .then(data => {
                    if (data?.data.getFriends.length > 0) {
                        const promises = data.data.getFriends.map((data: any) => {
                            let selectedUserId = (data.User.ID === user.id) ? data.Friend : data.User;
                            return check_story({
                                variables: {
                                    userid: selectedUserId.ID
                                }
                            }).then(validate => {
                                if (validate?.data.isUserHaveStory) {
                                    return { id: selectedUserId.ID, home: selectedUserId.HomePicture, profile: selectedUserId.ProfilePicture };
                                }
                                return null;
                            }).catch(err => {
                                console.log(err);
                                return null;
                            });
                        });

                        Promise.all(promises)
                            .then(friendStoryIds => {
                                const uniqueFriendStoryIds = friendStoryIds.reduce((acc, story) => {
                                    if (story !== null && !acc[story.id]) {
                                        acc[story.id] = story;
                                    }
                                    return acc;
                                }, {});
                                setFriendStory(Object.values(uniqueFriendStoryIds));
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                }).catch(err => {
                    console.log(err);
                });
        }
    }, [user]);

    const addFriendIndex = () => {
        if (storyIndex < friendStory.length - 1) {
            console.log(friendStory[storyIndex + 1])
            if (friendStory[storyIndex + 1]) {
                setStoryIndex(storyIndex + 1);
            } else {
                handleViewStory();
            }
        } else {
            handleViewStory();
        }
    }
    return (
        <div>
            <nav>
                <LoggedNavBar />
            </nav>
            <main className="grid">
                <div style={{ marginTop: "70px" }}></div>
                <div style={{ marginTop: "70px" }}></div>
                <div style={{ marginTop: "70px" }}></div>
            </main>
            <div className="grid">
                <div className="left-grid flex flex-col">
                    <div className="side-btn" onClick={handleProfile}><BiSolidUserCircle className="icon" />Profile</div>
                    <div className="side-btn" onClick={handleFriend}><FaUserFriends className="icon" />Find Friends</div>
                    <div className="side-btn" onClick={handleReels}><BiSolidVideo className="icon" />Reels</div>
                    <div className="side-btn" onClick={handleChat}><BsFillChatFill className="icon" />Chat</div>
                    <div className="side-btn" onClick={handleGroup}><HiUserGroup className="icon" />Groups</div>
                </div>
                <div></div>
                <div className="center-grid flex flex-col">
                    <div className="bg">
                        <div className="flex">
                            <div className="f-1">
                                <div className="flex justify-center align-center gap-5" onClick={() => setChooseSR(true)}>
                                    <FaBookOpen />
                                    <div>Stories</div>
                                </div>
                            </div>
                            <div className="f-1">
                                <div className="flex justify-center align-center gap-5" onClick={() => setChooseSR(false)}>
                                    <BiSolidVideo />
                                    <div>Reels</div>
                                </div>
                            </div>
                        </div>
                        <hr className="mt-10" />
                        {chooseSR ? (
                            <HomeStory friendStory={friendStory} setStoryIndex={setStoryIndex} handleViewStory={handleViewStory}  />
                        ) : (
                            <HomeReel />
                        )}
                    </div>
                    <div className="bg mt-15">
                        <div className="flex">
                            <img src={user?.profile} alt="" className="circle" />
                            <input type="text" className="post-box" placeholder={`What's on your mind, ${user.name}?`} onFocus={handleInputActive} />
                        </div>
                    </div>
                    <PostContainer></PostContainer>
                </div>
                {/* <div></div> */}
                <div className="right-grid">
                    <div className="flex max-width">
                        <div>
                            Contacts
                        </div>
                    </div>
                </div>
            </div>
            {isActive && <PostModal handleInputActive={handleInputActive} />}
            {toggleStory && (
                <StoryDisplay id={friendStory[storyIndex].id} handleViewStory={handleViewStory} addFriendIndex={addFriendIndex} />
            )}
            
        </div>
    )
}