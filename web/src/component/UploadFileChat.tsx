import "../pages/Chat.css";
import { ImCancelCircle } from "react-icons/im";
import RichText from "./RichText";
import { IoSend } from "react-icons/io5";


export default function UploadFileChat({ file, setFile, setMessage, key, handleSendMessage }: any) {
    let previewElement;

    if (file) {
        if (file.type.startsWith("image/")) {
            previewElement = <img src={URL.createObjectURL(file)} alt="" className="preview" />;
        } else if (file.type.startsWith("video/")) {
            previewElement = <video src={URL.createObjectURL(file)} className="preview" />;
        } else if (file.type.startsWith("audio/")) {
            previewElement = <audio src={URL.createObjectURL(file)} className="preview" />;
        }
    }

    const handleCancel = () => {
        setFile(null);
    }

    return (
        <div className="preview-container">
            <button onClick={handleCancel} className="cancel-btn">
                <ImCancelCircle className="cancel-icon" />
            </button>
            <div className="flex justify-center mb-10 bold font-18">Preview</div>
            {previewElement}
            <div className="flex">
                <div style={{ flex: "1", backgroundColor: "white" }}>
                    <RichText onContentChange={setMessage} key={key} />
                </div>
                <button style={{ border: "none", backgroundColor: "transparent" }} onClick={handleSendMessage}>
                    <IoSend className="chat-send-icon" />
                </button>
            </div>
        </div>
    );
}
