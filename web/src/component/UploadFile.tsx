import { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "./UploadFile.css";
import { getDownloadURL, getMetadata, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { useMutation } from "@apollo/client";
import { uploadFile } from "../apollo/filemutation";
import { toast } from "react-toastify";


export default function UploadFile({ handleToggleUpload, group, allFiles, setAllFiles }: any) {

    const fileInputRef = useRef<any>(null);

    const [file, setFile] = useState<File | null>(null);

    const [create_file] = useMutation(uploadFile);

    const classifyFileType = (fileName: string) => {
        let extension = fileName.split('.').pop()?.toLowerCase();
    
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
            return 'image';
        } else if (extension === 'mp4' || extension === 'avi' || extension === 'mov') {
            return 'video';
        } else if (extension === 'pdf') {
            return 'pdf';
        } else if (extension === 'docx') {
            return 'docx';
        } else if (extension === 'xlsx' || extension === 'xls') {
            return 'excel';
        } else {
            return 'other';
        }
    }
    

    useEffect(() => {
        const handleFileUpload = async () => {
            if (file) {
                const originalFileName = file.name;
                let fileName = originalFileName;
                let imageRef = ref(storage, `group/${group.ID}/${fileName}`);

                let fileNumber = 1;
                while (await exists(imageRef)) {
                    const [name, ext] = originalFileName.split(".");
                    fileName = `${name} (${fileNumber}).${ext}`;
                    imageRef = ref(storage, `group/${group.ID}/${fileName}`);
                    fileNumber++;
                }

                const filetype = classifyFileType(fileName);

                try {
                    await uploadBytes(imageRef, file);
                    const downloadURL = await getDownloadURL(imageRef);

                    create_file({
                        variables: {
                            groupid: group.ID,
                            name: fileName,
                            type: filetype,
                            path: downloadURL
                        }
                    }).then(data => {
                        setAllFiles([...allFiles, data.data.uploadGroupFile]);
                        toast.success("File uploaded successfully");
                        handleToggleUpload();
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        }

        if (file) {
            handleFileUpload();
        }
    }, [file])

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = () => {
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
            setFile(fileInputRef.current.files[0]);
        }
    }

    async function exists(ref: any) {
        try {
            await getMetadata(ref);
            return true;
        } catch (error) {
            console.log(error)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} />
            <div className="upload-modal">
                <div className="upload-modal-content">
                    <div className="upload-modal-header">
                        <div className="upload-modal-title">Upload File</div>
                        <AiOutlineCloseCircle className="upload-modal-close" onClick={handleToggleUpload} />
                    </div>
                    <hr style={{ width: "calc(100% - 0.25%)", marginBottom: "10px" }} />
                    <div className="file-input-padding">
                        <div className="file-input">
                            <div className="file-border" onDragOver={handleDragOver} onDrop={handleDrop} onClick={handleFileInputClick}>
                                <div className="file-input-title">Drag and drop file here</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}