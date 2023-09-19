import { useNavigate } from "react-router-dom"
import "./Members.css"
import { useMutation } from "@apollo/client";
import { kickMember, promoteAdmin } from "../../apollo/groupmember";
import { toast } from "react-toastify";


export default function Members({ group, userRole }: any) {


    const navigate = useNavigate();

    const [promote_admin] = useMutation(promoteAdmin);
    const [kick_member] = useMutation(kickMember);

    const handleProfile = (name: string) => () => {
        navigate("/profile/" + name, { replace: true });
    }

    const promote = (e: any, id: string) => {
        e.stopPropagation();
        promote_admin({
            variables: {
                groupid: group.ID,
                userid: id
            }
        }).then(() => {
            toast.success("Promoted to Admin")
        })
    }

    const kick = (e: any, id: string) => {
        e.stopPropagation();
        kick_member({
            variables: {
                groupid: group.ID,
                userid: id
            }
        }).then(() => {
            toast.success("Kicked from Group")
        })
    }

    if (!group) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <div className="group-admins">
                <div className="group-role-title">Admins :</div>
                {group.Admins.map((admin: any, index: number) => {
                    return (
                        <div key={admin.ID} onClick={handleProfile(admin.Name)} className="flex items-center mt-20">
                            <div className="name-font mr-20">{index + 1}. </div>
                            <img src={admin.ProfilePicture} alt="" className="circle" />
                            <div className="name-font">{admin.Name}</div>
                        </div>
                    )
                })}
            </div>
            <div className="group-admins">
                <div className="group-role-title">Members :</div>
                {group.Members.length > 0 && group.Members.map((member: any, index: number) => {
                    return (
                        <div key={member.ID} onClick={handleProfile(member.Name)} className="flex items-center justify-between mt-20">
                            <div className="flex items-center">
                                <div className="name-font mr-20">{index + 1}. </div>
                                <img src={member.ProfilePicture} alt="" className="circle" />
                                <div className="name-font">{member.Name}</div>
                            </div>
                            {userRole === "admin" && (
                                <div className="flex gap-5">
                                    <button className="promote-btn" onClick={(e: any) => promote(e, member.ID)}>Promote</button>
                                    <button className="group-leave-btn" onClick={(e: any) => kick(e, member.ID)}>Kick</button>
                                </div>
                            )}
                        </div>
                    )
                })}
                {group.Members.length === 0 && (
                    <div className="name-font flex justify-center">No Member</div>
                )}
            </div>
        </div>
    )
}