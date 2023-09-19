import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";



export default function HomeStory({friendStory, setStoryIndex, handleViewStory}: any) {

    const navigate = useNavigate();

    const handleCreateStory = () => {
        navigate("/create-story", { replace: true });
    }

    return (
        <div>
            <div className="flex gap-5 story">
                <div className="story-box" onClick={handleCreateStory}>
                    <div className="white-screen"></div>
                    <TbSquareRoundedPlusFilled className="overlay-img" onClick={handleCreateStory} />
                    <img
                        src="https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U"
                        alt=""
                        className="story-container" />
                </div>
                {
                    friendStory?.map((story: any, index: number) => {
                        return (
                            <div key={story.id} className="story-box" onClick={() => {
                                setStoryIndex(index);
                                handleViewStory();
                            }}>
                                <div className="white-screen"></div>
                                <img src={story.profile} alt="" className="overlay-img" />
                                <img
                                    src={story.home}
                                    alt=""
                                    className="story-container" />
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )

}