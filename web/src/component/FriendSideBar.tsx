import { FaUserGroup } from "react-icons/fa6";
import { BiSolidUserCheck, BiSolidUserPlus } from "react-icons/bi"
import "../pages/Friend.css"

export default function FriendSideBar() {


    return (
        <div>
            <div className="side-bar">
                <div className="content">
                    <h2>Friends</h2>
                    <div className="side-btn">
                        <div className="circle flex justify-center items-center">
                            <FaUserGroup className="side-bar-icon" />
                        </div>
                        <div className="font-17">Home</div>
                    </div>
                    <div className="side-btn">
                        <div className="circle flex justify-center items-center">
                            <BiSolidUserCheck className="side-bar-icon" />
                        </div>
                        <div className="font-17">Friend Request</div>
                    </div>
                    <div className="side-btn">
                        <div className="circle flex justify-center items-center">
                            <BiSolidUserPlus className="side-bar-icon" />
                        </div>
                        <div className="font-17">Friend Suggestion</div>
                    </div>
                </div>
            </div>
        </div>
    )
}