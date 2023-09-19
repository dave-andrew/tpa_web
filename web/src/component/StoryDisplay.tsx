import { useQuery } from "@apollo/client";
import { getUserStory } from "../apollo/storyquery";
import "./Story.css"
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


function StoryItem({ story, handleViewStory, length, handleNext, handlePrev }: any) {

    let count: number = 0;

    useEffect(() => {
        count = 100;
    }, [])

    return (
        <div key={story.ID} className="story-modal-container">
            <IoIosCloseCircleOutline onClick={handleViewStory} className="close-story-button" />
            <div style={{ position: "relative" }}>
                {story.StoryURL && (
                    <div>
                        <img src={story.StoryURL} alt="" className="story-content" />
                    </div>
                )}
                {story.Text && (
                    <div className="story-content" style={{ backgroundColor: story.Color, fontFamily: story.Font }}>
                        <p>{story.Text}</p>
                    </div>
                )}
                <div className="p" style={{ gridTemplateColumns: `repeat(${length}, 1fr)`, gap: "5px" }}>
                    {Array.from({ length }, (_, index) => (
                        <div className="slider-container">
                            <div key={index} className="slider" style={{ width: `${count}%` }}></div>
                        </div>
                    ))}
                </div>
            </div>
            <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handlePrev}>
                <BiLeftArrow className="reel-prev-btn" />
            </button>
            <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handleNext}>
                <BiRightArrow className="reel-next-btn" />
            </button>
        </div>
    );
}


export default function StoryDisplay({ id, handleViewStory, addFriendIndex }: any) {
    const { loading, data, error } = useQuery(getUserStory, {
        variables: {
            userid: id
        }
    });
    const [index, setIndex] = useState(0);

    if (data) {
        console.log(data);
    }

    console.log(data?.getUserStory.length)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prevIndex => {
                if (prevIndex < data?.getUserStory.length - 1) {
                    return prevIndex + 1;
                } else {
                    addFriendIndex();
                    return 0;
                }
            });
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [data?.getUserStory.length]);


    if (loading) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div>
                An error occurred: {error.message}
            </div>
        );
    }

    const handleNext = () => {
        if(data?.getUserStory.length <= index+1){
            handleViewStory();
        }else {
            setIndex(index + 1);
        }
    }

    const handlePrev = () => {
        if(index <= 0){
            setIndex(0);
        }else {
            setIndex(index - 1);
        }
    }

    return (
        <div>
            <StoryItem story={data?.getUserStory[index]} handleViewStory={handleViewStory} length={data?.getUserStory.length} handleNext={handleNext} handlePrev={handlePrev} />
        </div>
    );
}
