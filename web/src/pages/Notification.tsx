import { useQuery } from "@apollo/client";
import LoggedNavBar from "../component/LoggedNavBar";
import "./Notification.css"
import { useState } from "react";
import { getNotification } from "../apollo/notificationquery";


export default function Notification() {

    const [allNotif, setAllNotif] = useState<any[]>([]);

    const { loading } = useQuery(getNotification, {
        onCompleted: (data) => {
            setAllNotif(data?.getNotification);
            console.log(allNotif)
        },
    })

    const calculateUploadTime = (date: string) => {
        const dateFormat = new Date(date);
        const now = new Date();
        const timeDifference = now.getTime() - dateFormat.getTime();

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) {
            return `${years} ${years === 1 ? 'year' : 'years'} ago`;
        } else if (months > 0) {
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        } else if (days > 0) {
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else if (hours > 0) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else if (minutes > 0) {
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else {
            return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
        }
    }

    const markup = (jt: string) => {
        return { __html: jt };
    }

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <LoggedNavBar />

            <div className="notification-container">
                <div className="notification-box">
                    <div className="notification-header">
                        Notifications
                    </div>
                    <hr />
                    {allNotif.length === 0 ? (
                        <div className="flex justify-center items-center">No notifications yet</div>
                    ) : (
                        <div>
                            {allNotif.map((data: any) => (
                                <div className="notification-content" key={data.ID}>
                                    <div className="content">
                                        <img src={data.Sender.ProfilePicture} alt="" className="circle" />
                                        <div className="flex flex-col justify-center">
                                            <div dangerouslySetInnerHTML={markup(data.Message)} className="msg"></div>
                                            <div className="notif-hour">{calculateUploadTime(data.CreatedAt)}</div>
                                        </div>
                                    </div>
                                    {!data.Status && (
                                        <div className="circle status"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}