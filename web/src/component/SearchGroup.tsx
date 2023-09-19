import { useMutation, useQuery } from "@apollo/client"
import { checkUserRole } from "../apollo/groupquery"
import { useState } from "react"
import { requestGroup } from "../apollo/groupmutation";
import { toast } from "react-toastify";


export default function SearchGroup({ group }: any) {

    const [userRole, setUserRole] = useState<string>();

    const [request_group] = useMutation(requestGroup);

    const { } = useQuery(checkUserRole, {
        variables: {
            groupid: group.ID
        },
        onCompleted: (data) => {
            setUserRole(data?.checkUserRole)
        }
    })

    const handleRequestGroup = () => {
        request_group({
            variables: {
                groupid: group.ID
            }
        }).then(() => {
            toast.success("Request Sent")
        })
    }

    return (
        <div>
            <div className="search-people" key={group.ID}>
            <div className="flex items-center">
                <img src={group.ImageURL} alt="" className="circle" />
                <div className="flex flex-col">
                    <div>{group.Name}</div>
                </div>
            </div>
            {userRole === "none" && (
                <button className="add-friend-btn" onClick={handleRequestGroup}>Request Join</button>
            )}
        </div>
        </div>
    )
}