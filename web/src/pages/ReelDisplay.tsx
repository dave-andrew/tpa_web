import { BsArrowLeftShort } from "react-icons/bs"
import "./ReelDisplay.css"
import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { getReel } from "../apollo/reelquery"
import ReelContent from "../component/ReelContent"
import { useNavigate } from "react-router-dom"

export default function ReelDisplay() {

    const navigate = useNavigate();

    const [reel, setReel] = useState<any[]>([]);

    const {loading, data} = useQuery(getReel);
    const [index, setIndex] = useState<number>(0);

    const handleBackHome = () => {
        navigate("/", { replace: true });
    }


    useEffect(() => {
        if(data){
            setReel(data?.getReels);
        }
    }, [])

    // console.log(reel[index]);
    const handleNext = () => {
        setIndex(index + 1);
        if(reel.length <= index+1){
            navigate("/", { replace: true });
        }
    }

    const handlePrev = () => {
        if(index <= 0){
            setIndex(0);
        }else {
            setIndex(index - 1);
        }
    }

    if(loading){
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div className="reel-container">
            <BsArrowLeftShort className="reel-back-btn" onClick={handleBackHome} />
            <ReelContent key={index} reelData={reel[index]} handleNext={handleNext} handlePrev={handlePrev} />
        </div>
    )
}