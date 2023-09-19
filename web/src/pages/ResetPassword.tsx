import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react"
import { useMutation } from "@apollo/client";
import { change_password } from "../apollo/mutation";
import { toast } from "react-toastify";
import "./ResetPassword.css"
import "./Register.css"
import Footer from "../component/Footer";

export default function ResetPassword() {

    const navigate = useNavigate();

    const [last, setLast] = useState<string>(""); 
    const [password, setPassword] = useState<string>("");
    const [confirmPass, setConfirmPass] = useState<string>("");

    const { token } = useParams();
    // console.log(token);



    const [changePass] = useMutation(change_password)

    const handleResetPassword = () => {
        if (password === confirmPass) {
            changePass({
                variables: {
                    token: token,
                    oldpass: last,
                    pass: password
                }
            }).catch(err => {
                console.log(err);
            }).then((data) => {
                if(data?.data?.changePassword){
                    toast.success("Password changed successfully!");
                    navigate("/login", {replace: true});
            }})
        }
    }

    return (
        <div className="container">
            <div className="modal-container">
                <div className="font-size-20 bold">
                    Recovery Password
                </div>
                <hr className="mt-10" />
                <div className="width-80">
                    <div className="flex flex-col mb-10">
                        <input type="password" id="lastpass" className="pass-box font-size-15" placeholder="Last Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLast(e.target.value)} value={last} />
                        <input type="password" id="pass" className="pass-box font-size-15" placeholder="Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} value={password} />
                        <input type="password" id="confirm" className="pass-box font-size-15" placeholder="Confirm Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value)} value={confirmPass} />
                    </div>
                </div>
                <button onClick={handleResetPassword} className="btn">Reset Password</button>
            </div>
            <Footer />
        </div>
    )
}