import { Link, Navigate, useNavigate } from "react-router-dom"
import "./Register.css"
import { useState } from "react"
import { useLazyQuery } from "@apollo/client";
import { getUser, loginUser } from "../apollo/query";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { updateTokenAndResetCache } from "../apollo/apolloClient";
import Footer from "../component/Footer";
export default function Login() {

    const navigate = useNavigate();

    const { user, setUser } = useAuth();

    const [login_user, { loading }] = useLazyQuery(loginUser);
    const [get_user] = useLazyQuery(getUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleToRegister = () => {
        navigate("/register", { replace: true });
    }

    const handleLogin = async () => {
        login_user({
            variables: {
                email: email,
                pass: password
            }
        }).catch(error => {
            console.log(error)
        }).then((data) => {
            console.log(data);
            if (data?.error?.message) {
                toast.error(data?.error?.message)
            } else {
                updateTokenAndResetCache(data?.data?.login)
                get_user()
                    .catch(err => {
                        console.log("Error get user: " + err);
                    }).then(data => {
                        const userData = data?.data?.getUser;
                        console.log(userData);
                        setUser({
                            ...user,
                            id: userData.ID,
                            name: userData.Name,
                            email: userData.Email,
                            dob: userData.DOB,
                            surname: userData.Surname,
                            gender: userData.Gender,
                            home: userData.HomePicture,
                            profile: userData.ProfilePicture
                        });
                    });
                navigate("/", { replace: true });
            }
        })
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container">
            <h1>FaREbook</h1>
            <div className="modal-container">
                <div className="flex flex-col gap width mb-10">
                    <h4 className="center">Log in to FaREbook</h4>
                    <input type="text" className="text-box" placeholder="Email Address" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} value={email} />
                    <input type="password" className="text-box" placeholder="Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} value={password} />
                    <button className="btn-login center" onClick={handleLogin}>Log In</button>
                    <Link to="/recover" className="text-link center">Forgotten Account?</Link>
                </div>
                <div className="flex gap max-width justify-center items-center">
                    <hr />
                    <div className="text-link sm">or</div>
                    <hr />
                </div>
                <button onClick={handleToRegister} className="btn toRegis">Create New Account</button>
            </div>
            <Footer></Footer>
        </div>
    )
}