import { useQuery } from "@apollo/client";
import { checkUserRole } from "../apollo/groupquery";
import { useAuth } from "../context/AuthContext";
import { BsFillTrashFill } from "react-icons/bs";
import { useState } from "react";

export default function Trash({ groupid, post, handleDeletePost }: any) {
    
    const { user } = useAuth();

    const [userRole, setUserRole] = useState<string>("");

    const { } = useQuery(checkUserRole, {
        variables: {
            groupid: groupid
        }, onCompleted: (data) => {
            setUserRole(data?.checkUserRole)
        }
    });

    return (
        <div>
            {(user.name === post.User.Name || userRole === "admin") && (
                <BsFillTrashFill className="trash-icon" onClick={() => handleDeletePost(post.ID)} />
            )}
        </div>
    )
}