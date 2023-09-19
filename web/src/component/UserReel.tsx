import { useQuery } from "@apollo/client";
import { getUserReel } from "../apollo/reelquery";
import { useState } from "react";
import "./UserReel.css";

export default function UserReel({ userid }: any) {
    const [allReel, setReel] = useState<any[]>([]);

    const { loading } = useQuery(getUserReel, {
        variables: {
            userid: userid
        },
        onCompleted: (data) => {
            setReel(data.getUserReel);
        }
    });

    const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
        const video = event.currentTarget;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {allReel.length === 0 && (
                <div className="shadow">
                    This User Currently Has No Reel
                </div>
            )}
            {allReel.map((reel) => (
                <div className="shadow" style={{ backgroundColor: "white", marginTop: "20px", padding: "20px" }} key={reel.ID}>
                    <div className="flex justify-center">
                        <div className="flex justify-center items-center">
                            <img src={reel.User.ProfilePicture} alt="" className="circle" />
                            <div className="bold font-18">{reel.User.Name}</div>
                        </div>
                    </div>
                    <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
                    <div className="flex justify-center">
                        <video src={reel.Url} className="video-preview" onClick={handleVideoClick}></video>
                    </div>
                </div>
            ))}
        </div>
    );
}
