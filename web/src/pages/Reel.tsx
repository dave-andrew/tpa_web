import { AiOutlineCloseCircle } from "react-icons/ai"
import "./Reel.css"
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { createReel } from "../apollo/reelmutation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

export default function Reel() {

    const navigate = useNavigate();

    const [video, setVideo] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const [create_reel] = useMutation(createReel);

    const handleBackHome = () => {
        navigate("/", { replace: true });
    }

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
    
        if (file) {
            const allowedFormats = ["mp4", "avi"];
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
            if (fileExtension && allowedFormats.includes(fileExtension)) {
                const video = document.createElement("video");
                video.preload = "metadata";
                video.src = URL.createObjectURL(file);
    
                video.onloadedmetadata = () => {
                    if (video.duration >= 1 && video.duration <= 60) {
                        setVideo(file);
                        setVideoUrl(URL.createObjectURL(file));
                    } else {
                        e.target.value = "";
                        toast.error("Video duration must be between 1 and 60 seconds");
                    }
                };
            } else {
                e.target.value = "";
                toast.error("Only mp4 and avi formats are allowed");
            }
        }
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    const date = new Date();
    const handleCreateReel = () => {
        if(video){
            const imageRef = ref(storage, `reel/${video.name}+${date}`)
            uploadBytes(imageRef, video).then((data: any) => {
                const path = data.metadata.fullPath;
                const imgRef = ref(storage, path);
                getDownloadURL(imgRef)
                    .then((downloadURL: any) => {
                        create_reel({
                            variables: {
                                url: downloadURL
                            }
                        }).catch(err => {
                            console.log(err);
                            toast.error("There is an error posting the reel")
                        }).then((_: any) => {
                            // console.log(data);
                            toast.success("Reels posted");
                            navigate("/", {replace: true})
                        })
                    })
            })
        }else{
            toast.error("Please upload a video");
        }
    }

    return (
        <div>
            <AiOutlineCloseCircle className="reel-close-btn" onClick={handleBackHome} />
            <div className="create-reel-grid">
                <div className="reel-left-grid">
                    <hr className="mt-80" />
                    <div className="ml-30">
                        <div className="reel-header">Create a new Reel</div>
                        <input type="file" accept="video/*" onChange={onFileChange} />
                    </div>
                    <button className="create-reel-btn" onClick={handleCreateReel}>Create Reel</button>
                </div>
                <div className="reel-preview-container">
                    <div className="reel-preview-card">
                        <div className="mb-10 reel-preview">Preview</div>
                        <hr />
                        <video ref={videoRef} src={videoUrl} className="reel-video" autoPlay loop preload="metadata" onClick={togglePlayPause} />
                    </div>
                </div>
            </div>
        </div>
    )

}