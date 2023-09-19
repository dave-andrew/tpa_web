import { useQuery } from "@apollo/client";
import { getFriendUser } from "../apollo/friendquery";
import { useState } from "react";
import "./FriendListModal.css";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function FriendListModal({ handleToggleFriend, chosenFriend, setChosenFriend, execute }: any) {
    const [allFriend, setAllFriend] = useState<any[]>([]);

    const { loading } = useQuery(getFriendUser, {
        onCompleted: (data) => {
            setAllFriend(data?.getFriendUser);
        }
    });

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFriendId = event.target.value;

        if (!chosenFriend.includes(selectedFriendId)) {
            setChosenFriend([...chosenFriend, selectedFriendId]);
        } else {
            setChosenFriend(chosenFriend.filter((id: any) => id !== selectedFriendId));
        }
    };

    const handleCancel = () => {
        setChosenFriend([]);
        handleToggleFriend();
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="bg-modal"></div>
            <div className="friend-list-modal">
                <IoIosCloseCircleOutline onClick={handleToggleFriend} className="friend-list-modal-close" />
                <div className="friend-list-header">
                    <div className="friend-list-title">Invite Friends</div>
                </div>
                <div className="friend-list">
                    {allFriend.map((data: any) => (
                        <div className="friend-item" key={data.ID}>
                            <label htmlFor={data.ID} className="flex items-center flex-1 padding-friend-item">
                                <img src={data.ProfilePicture} alt="" className="circle" />
                                <div>{data.Name}</div>
                            </label>
                            <input
                                type="checkbox"
                                name={data.ID}
                                id={data.ID}
                                value={data.ID}
                                className="friend-checkbox"
                                onChange={handleCheckboxChange}
                                checked={chosenFriend.includes(data.ID)}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex flex-end mt-20">
                    <button className="friend-cancel-btn" onClick={handleCancel}>Cancel</button>
                    <button className="friend-invite-btn" onClick={execute}>Invite</button>
                </div>
            </div>
        </div>
    );
}
