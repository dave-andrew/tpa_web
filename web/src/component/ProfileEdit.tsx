import { AiOutlineCloseCircle } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./ProfileEdit.css";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { updateUserProfile } from "../apollo/query";

export default function ProfileEdit({ handleToggleEdit }: any) {
    const { user, setUser } = useAuth();

    const userDob = user.dob ? new Date(user.dob).toISOString().split('T')[0] : "";

    const [name, setName] = useState<string>(user.name);
    const [surname, setSurname] = useState<string>(user.surname);
    const [dob, setDob] = useState<string>(userDob);

    const [update_user_profile] = useMutation(updateUserProfile)

    const handleEdit = () => {
        if (!name || !surname || !dob) {
            toast.error("Please fill in all fields");
            return;
        } else if (!(name === user.name) || !(surname === user.surname) || !(dob === userDob)) {
            const formattedDob = new Date(dob + 'T00:00:00Z').toISOString();
            update_user_profile({
                variables: {
                    name: name,
                    surname: surname,
                    dob: formattedDob
                }
            })
            .then((data) => {
                setUser(data.data.updateUserProfile);
                toast.success("Profile updated successfully");
                handleToggleEdit();
            }).catch((err) => {
                console.log(err);   
            });

        } else {
            toast.error("No changes made");
            return;
        }
    }

    return (
        <div>
            <div className="black-bg" style={{ zIndex: "1000", position: "fixed" }}></div>
            <div className="edit-profile-modal">
                <AiOutlineCloseCircle onClick={handleToggleEdit} className="edit-close-btn" />
                <div className="edit-profile-header">
                    <div className="flex justify-center bold" style={{ fontSize: "18px" }}>Edit Profile</div>
                </div>
                <hr />
                <div className="flex flex-col justify-center" style={{ gap: "15px" }}>
                    <input type="text" className="edit-profile-field" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                    <input type="text" className="edit-profile-field" value={surname} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSurname(e.target.value)} />
                    <input type="date" className="edit-profile-field" value={dob} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDob(e.target.value)} />
                </div>
                <div className="flex justify-end mt-30" style={{ gap: "5px", marginRight: "30px" }}>
                    <button className="friend-cancel-btn" onClick={handleToggleEdit}>Close</button>
                    <button className="friend-invite-btn" onClick={handleEdit}>Edit</button>
                </div>
            </div>
        </div>
    )
}
