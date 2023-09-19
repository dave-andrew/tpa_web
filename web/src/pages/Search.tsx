import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom"
import { searchUser } from "../apollo/query";
import { useState } from "react";
import LoggedNavBar from "../component/LoggedNavBar";
import "./Search.css"
import { FaFilm, FaUserFriends } from "react-icons/fa";
import { BsPostcardFill } from "react-icons/bs";
import SearchUser from "../component/SearchUser";
import SearchPost from "../component/SearchPost";
import { searchGroup } from "../apollo/groupquery";
import SearchGroup from "../component/SearchGroup";
import { HiUserGroup } from "react-icons/hi";


export default function Search() {

    const { value } = useParams();

    const [filter, setFilter] = useState<string>("All");

    const [fetchedUser, setFetchedUser] = useState<any[]>([]);
    const [fetchedGroup, setFetchedGroup] = useState<any[]>([]);

    console.log(fetchedGroup)

    // console.log(fetchedUser);
    // console.log(fetchedPost);

    const { loading: userLoading } = useQuery(searchUser, {
        variables: {
            search: value
        },
        onCompleted: (data) => {
            console.log(data);
            setFetchedUser(data.searchUser);
        }
    })

    const { loading: groupLoading } = useQuery(searchGroup, {
        variables: {
            search: value
        },
        onCompleted: (data) => {
            setFetchedGroup(data.searchGroups);
        }
    })

    return (
        <div>
            <LoggedNavBar />
            <div className="search-container">
                <div className="search-side-bar">
                    <div className="search-side-header">
                        Search Results
                    </div>
                    <hr className="mt-10 mb-20" />
                    <div className={`search-side-content ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>
                        <div className="circle search-icon-container">
                            <FaFilm className="search-side-icon" />
                        </div>
                        All
                    </div>
                    <div className={`search-side-content ${filter === "People" ? "active" : ""}`} onClick={() => setFilter("People")}>
                        <div className="circle search-icon-container">
                            <FaUserFriends className="search-side-icon" />
                        </div>
                        People
                    </div>
                    <div className={`search-side-content ${filter === "Post" ? "active" : ""}`} onClick={() => setFilter("Post")}>
                        <div className="circle search-icon-container">
                            <BsPostcardFill className="search-side-icon" />
                        </div>
                        Post
                    </div>
                    <div className={`search-side-content ${filter === "Group" ? "active" : ""}`} onClick={() => setFilter("Group")}>
                        <div className="circle search-icon-container">
                            <HiUserGroup className="search-side-icon" />
                        </div>
                        Groups
                    </div>
                </div>
                <div className="search-content">
                    {userLoading && (
                        <div className="user-loading-skeleton">
                            <div className="white-animation"></div>
                        </div>
                    )}
                    {groupLoading && (
                        <div className="group-loading-skeleton">
                            <div className="white-animation"></div>
                        </div>
                    )}
                    {(!userLoading && (filter === "All" || filter === "People")) && (
                        <div className="search-result">
                            <div className="bold font-18">
                                Peoples
                            </div>
                            <hr className="mt-10 mb-10" />
                            {fetchedUser.map((user: any) => (
                                <SearchUser user={user} />
                            ))}
                        </div>
                    )}
                    {(!userLoading && (filter === "All" || filter === "Group")) && (
                        <div className="search-result">
                            <div className="bold font-18">
                                Groups
                            </div>
                            <hr className="mt-10 mb-10" />
                            {fetchedGroup.map((group: any) => (
                                <SearchGroup group={group} />
                            ))}
                        </div>
                    )}
                    {(filter === "All" || filter === "Post") && (
                        <div className="search-post-container">
                            <SearchPost value={value} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}