import { useQuery } from "@apollo/client";
import { FaSearch } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdFeed } from "react-icons/md";
import { RiCompassDiscoverFill } from "react-icons/ri";
import { getUserGroup } from "../apollo/groupquery";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function GroupSidebar() {
    const navigate = useNavigate();

    const [search, setSearch] = useState<string>("");
    const [groupList, setGroupList] = useState<any[]>([]);
    const [filteredGroupList, setFilteredGroupList] = useState<any[]>([]);

    const handleCreateGroup = () => {
        navigate("/create-group", { replace: true });
    }

    useQuery(getUserGroup, {
        onCompleted: (data) => {
            setGroupList(data.getUserGroups);
            setFilteredGroupList(data.getUserGroups);
        }
    });

    const handleGroupProfile = (id: string) => {
        navigate(`/group/${id}`, { replace: true })
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = e.target.value.toLowerCase();
        setSearch(searchText);

        const filteredGroups = groupList.filter((group) =>
            group.Name.toLowerCase().includes(searchText)
        );
        setFilteredGroupList(filteredGroups);
    }

    const handleNavigateGroup = () => {
        navigate("/group", { replace: true })
    }

    return (
        <div>
            <div className="group-side-bar">
                <div className="group-side-header">Groups</div>
                <div className="chat-search">
                    {search === "" ? <FaSearch className="chat-search-icon" /> : null}
                    <input
                        type="text"
                        placeholder="       Search"
                        className="input"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <div className="group-side active" onClick={handleNavigateGroup}>
                    <div className="circle flex justify-center items-center">
                        <MdFeed className="group-icons" />
                    </div>
                    Your Feed
                </div>
                <div className="group-side">
                    <div className="circle flex justify-center items-center">
                        <RiCompassDiscoverFill className="group-icons" />
                    </div>
                    Discover
                </div>
                <div className="group-side">
                    <div className="circle flex justify-center items-center">
                        <HiUserGroup className="group-icons" />
                    </div>
                    Your Groups
                </div>
                <div className="ml-10 mr-10 mt-10">
                    <button className="create-group-btn" onClick={handleCreateGroup}>+ Create new group</button>
                    <hr className="mt-10 mb-10" />
                    <div className="group-list-header">
                        Groups you've joined
                    </div>
                    <div className="group-list-container">
                        {filteredGroupList.map((group) => (
                            <div className="group-list" key={group.ID} onClick={() => handleGroupProfile(group.ID)}>
                                {group.image ? (
                                    <img src={group.image} alt="" />
                                ) : (
                                    <img src="https://png2.cleanpng.com/sh/53bbd2fa5085d26e742d846d64dd3da7/L0KzQYm3V8I5N6tnkpH0aYP2gLBuTfNwdaF6jNd7LXnmf7B6Tflkd58yfNd8aXfxPcb6hgJ0NZh3hAd5LXf1f8b3Tflkd58yTdQAY0e0QreBWPQ4OGYzSKsEOUS2QIS4VcMzP2k5UaY8NUazRXB3jvc=/kisspng-computer-icons-icon-design-users-group-group-icon-5b5c712f88d705.0999430315327849435605.png" alt="" className="group-icon" />
                                )}
                                <div>
                                    <div className="group-name">{group.Name}</div>
                                    <div className="last-active">Last Active </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
