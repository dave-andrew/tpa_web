import { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export default function ImageCarousel({ postImage }: any) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(postImage.length - 1);
    }, []);

    const handleLeft = () => {
        setIndex((prevIndex) => (prevIndex === 0 ? postImage.length - 1 : prevIndex - 1));
    };

    const handleRight = () => {
        setIndex((prevIndex) => (prevIndex + 1) % postImage.length);
    };

    return (
        <div className="relative">
            <div onClick={handleLeft} className="button-left"><BsChevronLeft /></div>
            <img src={postImage[index]} alt="" className="post-img" key={index} />
            <div onClick={handleRight} className="button-right"><BsChevronRight /></div>
        </div>
    );
}
