import { useNavigate } from "react-router-dom"
import "./Register.css"
import Navbar from "../component/Navbar";
import { useLazyQuery } from "@apollo/client";
import { changePassEmail } from "../apollo/query";
import { useState } from "react"
import { toast } from "react-toastify";
import Footer from "../component/Footer";

export default function Recover() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [changePass] = useLazyQuery(changePassEmail)

    const handleCancel = () => {
        navigate('/login', { replace: true });
    }

    const handleSearch = () => {
        changePass({
            variables: {
                email: email
            }
        }).catch(error => {
            console.log(error);   
        }).then(data => {
            console.log(data);
            toast.info(data?.data?.changePasswordEmail);
        });
    }

    return (
        <div className="container">
            <Navbar></Navbar>
            <div>.</div>
            <div className="modal-container align-left">
                <div className="mlr-10">
                    <h4 className="text-left">Find Your Account</h4>
                </div>
                <hr />
                <div className="mlr-10">
                    <p>Please enter your email address to search for your account.</p>
                    <div className="max-width flex justify-center">
                        <input type="email" className="text-box margin-auto" placeholder="Email Address" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(e.target.value);
                        }} value={email} />
                    </div>
                </div>
                <hr className="mg-top" />
                <div className="width flex justify-end gap mlr-10">
                    <button className="btn-gray" onClick={handleCancel}>Cancel</button>
                    <button className="btn-blue" onClick={handleSearch}>Search</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}