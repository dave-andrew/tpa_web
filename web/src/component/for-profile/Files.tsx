import { BiSearch, BiTrash } from "react-icons/bi";
import "./Files.css";
import { useEffect, useState } from "react";
import UploadFile from "../UploadFile";
import { useMutation, useQuery } from "@apollo/client";
import { getGroupFiles } from "../../apollo/filequery";
import { deleteGroupFile } from "../../apollo/filemutation";
import { toast } from "react-toastify";
import { checkUserRole } from "../../apollo/groupquery";
import { useAuth } from "../../context/AuthContext";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";



export default function Files({ group }: any) {

    const { user } = useAuth();

    const [search, setSearch] = useState<string>("");
    const [toggleUpload, setToggleUpload] = useState<boolean>(false);
    const [sortDate, setSortDate] = useState<boolean>(false);

    const [userRole, setUserRole] = useState<string>("");

    const { } = useQuery(checkUserRole, {
        variables: {
            groupid: group.ID
        },
        onCompleted: (data) => {
            console.log(data)
            setUserRole(data?.checkUserRole)
        }
    })

    const [allFiles, setAllFiles] = useState<any[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<any[]>([]);

    const { } = useQuery(getGroupFiles, {
        variables: {
            groupid: group.ID
        }, onCompleted: (data) => {
            setAllFiles(data?.getGroupFiles);
            setFilteredFiles(data?.getGroupFiles);
        }
    })

    const [delete_group_file] = useMutation(deleteGroupFile);

    const handleToggleUpload = () => {
        setToggleUpload(!toggleUpload)
    }

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = e.target.value.toLowerCase();
    
        setSearch(searchText);
    
        if (searchText === "") {
            setFilteredFiles(allFiles);
        } else {
            const filteredFiles = allFiles.filter((file) =>
                file.Name.toLowerCase().includes(searchText)
            );
            setFilteredFiles(filteredFiles);
        }
    }
    

    const handleDeleteFile = (fileid: string, filename: string) => {
        delete_group_file({
            variables: {
                fileid: fileid
            }
        }).then((data) => {
            if (data.data.deleteGroupFile) {

                const imageRef = ref(storage, "group/" + group.ID + "/" + filename);
                deleteObject(imageRef).then(() => {
                    setAllFiles(allFiles.filter((file) => file.ID !== fileid));
                    setFilteredFiles(allFiles.filter((file) => file.ID !== fileid));
                    toast.success("File deleted successfully");
                }).catch((err) => {
                    console.log(err);
                })
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleDownloadFile = (filepath: string) => {
        const link = document.createElement('a');
        link.href = filepath;
        link.download = filepath.split("/").pop() || "";
        console.log(filepath)
        link.click();   
    }

    const toggleOrder = () => {
        setSortDate(!sortDate)
        const sortedFiles = [...filteredFiles].reverse();
        setFilteredFiles(sortedFiles);
    }

    // console.log(group)
    // console.log(allFiles)

    return (
        <div>
            <div className="group-admins" style={{ paddingLeft: "20px" }}>
                <div className="flex justify-between">
                    <div className="group-role-title">
                        Files
                    </div>
                    <div className="flex items-center">
                        {search === "" && (
                            <BiSearch className="file-search-icon" />
                        )}
                        <input type="text" className="file-search-input" placeholder="       Search File" value={search} onChange={handleSearch} />
                        <div className="upload-file" onClick={handleToggleUpload}>Upload File</div>
                    </div>
                </div>
                <hr className="mt-10 mb-10" />
                <div className="file-header-grid">
                    <div className="file-header-bg">File Name</div>
                    <div className="file-header-bg">Type</div>
                    <div className="file-header-bg" onClick={toggleOrder}>Uploaded Date{sortDate ? (
                        <FaSortDown />
                    ) : (
                        <FaSortUp />
                    )}</div>
                    <div></div>
                </div>
                {filteredFiles.length > 0 && (
                    <div>
                        {filteredFiles.map((file: any) => (
                            <div className="file-hover" key={file.ID}>
                                <div className="file-header-grid">
                                    <div className="file-content-bg"><div className="file-name" onClick={() => handleDownloadFile(file.Path)}>{file.Name}</div></div>
                                    <div className="file-content-bg">{file.Type}</div>
                                    <div className="file-content-bg">
                                        <div>
                                            <div>{formatTimestamp(file.CreatedAt)}</div>
                                            <div>Created By: {file.User.Name}</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {(userRole === "admin" || user.name === file.User.Name) && (
                                            <BiTrash className="file-trash" onClick={() => handleDeleteFile(file.ID, file.Name)} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {allFiles.length === 0 && (
                    <div className="flex items-center justify-center">
                        No files found
                    </div>
                )}
            </div>
            {toggleUpload && (
                <UploadFile handleToggleUpload={handleToggleUpload} group={group} allFiles={allFiles} setAllFiles={setAllFiles} />
            )}
        </div>
    )
}