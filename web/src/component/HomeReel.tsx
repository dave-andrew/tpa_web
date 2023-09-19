import { AiFillPlusCircle } from "react-icons/ai";
import { MdVideoLibrary } from "react-icons/md";
import { useNavigate } from "react-router-dom";



export default function HomeReel() {

    const navigate = useNavigate();

    const handleCreateReel = () => {
        navigate("/create-reel", { replace: true });
    }

    const handleReelPage = () => {
        navigate("/reels", { replace: true });
    }

    return (
        <div>
            <div className="flex items-center">
                <div className="circle ml-30 mb-10 pointer" onClick={handleCreateReel}>
                    <AiFillPlusCircle style={{ width: "100%", height: "100%", color: "darkblue" }} />
                </div>
                <div className="mb-10 bold">
                    Create a new Reel!
                </div>
            </div>
            <div className="flex items-center">
                <div className="circle ml-30 mb-10 pointer flex justify-center items-center" onClick={handleReelPage}>
                    <MdVideoLibrary style={{ width: "70%", height: "70%", color: "darkblue" }} />
                </div>
                <div className="mb-10 bold">
                    See other reels!
                </div>
            </div>
        </div>
    )
}