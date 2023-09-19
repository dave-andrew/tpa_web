import { AiOutlineSearch, AiFillHome, AiFillMessage } from "react-icons/ai";
import { BsFillPeopleFill } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import { MdNotifications } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BsFillPersonFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { useQuery } from "@apollo/client";
import { countNotification } from "../apollo/notificationquery";

export default function LoggedNavBar() {
    const { user } = useAuth();

    const [searchValue, setSearchValue] = useState('');
    const [dropdown, setDropdown] = useState(false);

    const [totalNotif, setTotalNotif] = useState(0);

    const navigate = useNavigate();

    const { } = useQuery(countNotification, {
        onCompleted: (data) => {
            setTotalNotif(data?.countNotification);
        }
    });

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleHome = () => {
        navigate("/", { replace: true });
    };

    const handleFriend = () => {
        navigate("/friends", { replace: true });
    }

    const toggleDropdown = () => {
        setDropdown(!dropdown);
    };

    const handleToProfile = () => {
        navigate(`/profile/${user.name}`, { replace: true });
    };

    const handleLogOut = () => {
        localStorage.removeItem("jwt");
        navigate("/login", { replace: true });
    };

    const handleChat = () => {
        navigate("/chat", { replace: true });
    }

    const handleNotif = () => {
        navigate("/notification", { replace: true });
    }

    const handleSearch = () => {
        navigate(`/search/${searchValue}`, { replace: true });
    }

    const handleGroup = () => {
        navigate("/group", { replace: true });
    }

    return (
        <div>
            <div className="nav grid">
                <div className="self-left">
                    <div className="left-nav">
                        <div>
                            <img src="fb.png" alt="" className="icon" />
                        </div>

                        <form action="" onSubmit={handleSearch}>
                            <div className="ml-30 flex align-center" style={{ position: "relative" }}>
                                <input type="text" placeholder="     Search" className="search" value={searchValue} onChange={handleSearchInput} />
                                {!searchValue && <AiOutlineSearch className="left-nav-icon" />}
                            </div>
                        </form>
                    </div>
                </div>
                <div className="self-center">
                    <div className="flex gap-10">
                        <AiFillHome className="middle-icon" onClick={handleHome} />
                        <BsFillPeopleFill className="middle-icon" onClick={handleFriend} />
                        <HiUserGroup className="middle-icon" onClick={handleGroup} />
                    </div>
                </div>
                <div className="self-end mr-20">
                    <div className="flex gap justify-center items-center">
                        <div className="circle-bg flex justify-center items-center" onClick={handleChat}>
                            <AiFillMessage className="right-icon" />
                        </div>
                        <div className="circle-bg flex justify-center items-center pos-relative" onClick={handleNotif}>
                            <MdNotifications className="right-icon" />
                            {totalNotif > 0 && (
                                <div className="notif-badge">{totalNotif}</div>
                            )}
                        </div>
                        <img src={user.profile} alt="" className="circle pointer" onClick={toggleDropdown} />
                    </div>
                </div>
            </div>
            {dropdown && (
                <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={handleToProfile}>
                        <BsFillPersonFill className="dd-icon" />
                        <div>Profile</div>
                    </div>
                    <div className="dropdown-item" onClick={handleLogOut}>
                        <BiLogOut className="dd-icon" />
                        <div>Logout</div>
                    </div>
                </div>
            )}
        </div>
    );
}
