import { useMutation, useQuery } from "@apollo/client"
import { getGroupRequest } from "../../apollo/groupquery"
import { useState } from "react"
import "./Members.css"
import { acceptRequest, rejectRequest } from "../../apollo/groupmember"
import { toast } from "react-toastify"
import { createNotification } from "../../apollo/notificationmutation"
import { addGroupUser } from "../../apollo/chatmutation"


export default function Request({ group }: any) {

    const [request, setRequest] = useState<any[]>([])

    const [accept_request] = useMutation(acceptRequest);
    const [reject_request] = useMutation(rejectRequest);
    const [notif] = useMutation(createNotification)
    const [add_group_user] = useMutation(addGroupUser);

    // console.log(request)

    const { } = useQuery(getGroupRequest, {
        variables: {
            groupid: group.ID
        }, onCompleted: (data) => {
            // console.log(data);
            setRequest(data?.getGroupRequest)
        }
    })

    const handleDecline = (userid: string) => {
        reject_request({
            variables: {
                groupid: group.ID,
                userid: userid
            }
        }).then(() => {            
            notif({
                variables: {
                    userid: userid,
                    message: "<p>Your request to join <b>" + group.Name + "</b> has been declined!</p>"
                }
            }).then(() => {
                toast.success("Request Declined")
            })
        })
    }

    const handleAccept = (userid: string) => {
        accept_request({
            variables: {
                groupid: group.ID,
                userid: userid
            }
        }).then(() => {
            add_group_user({
                variables: {
                    groupid: group.ID,
                    userid: userid
                }
            }).then(() => {
                notif({
                    variables: {
                        userid: userid,
                        message: "<p>Your request to join <b>" + group.Name + "</b>a  has been accepted!</p>"
                    }
                }).then(() => {
                    toast.success("Request Accepted");
                })
            });
        })
    }

    return (
        <div>
            <div className="group-admins">
                <div className="request-title">Pending Request List:</div>
                <hr />
                {request.length > 0 ? (
                    request.map((req: any) => (
                        <div key={req.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={req.User.ProfilePicture} alt={req.User.Name} className="circle" />
                                <p>{req.User.Name}</p>
                            </div>
                            <div className="flex gap-5">
                                <button className="request-decline" onClick={() => handleDecline(req.User.ID)}>Decline</button>
                                <button className="request-accept" onClick={() => handleAccept(req.User.ID)}>Accept</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center">No Pending Request</div>
                )}
            </div>
        </div>
    );
}