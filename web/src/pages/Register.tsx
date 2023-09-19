import { useState } from "react"
import "./Register.css"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { create_user } from "../apollo/mutation"
import Footer from "../component/Footer";

export default function Register() {

    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");

    const navigate = useNavigate();

    const [createUser] = useMutation(create_user);

    const handleRegister = () => {

        if (!firstName) {
            toast.warning("Please enter first name");
            return;
        } else if (firstName.length < 3 || firstName.length > 20) {
            toast.warning("First name lenght must be between 3 and 20 characters");
            return;
        }

        if (!surname) {
            toast.warning("Please enter surname");
            return;
        }

        //surname must be unique
        // else if () {

        // }

        if (!email) {
            toast.warning("Please enter email");
            return;
        } else if (!isValidEmail(email)) {
            toast.warning("Invalid Email!");
            return;
        }

        if (!password) {
            toast.warning("You want your account to be hacked?");
            return;
        } else if (password.length < 8) {
            toast.warning("Password so short eh?");
            return;
        } else if (!isValidPassword(password)) {
            toast.warning("Password must be alphanumeric!");
            return;
        }

        if (!dob) {
            toast.warning("You don't have birth date?");
            return;
        } else if (!is17YearsOld(dob)) {
            toast.warning("You must be 17 years old!");
            return;
        }

        if (!gender) {
            toast.warning("Undefined gender huh? I see...");
            return;
        }

        const formattedDob = new Date(dob + 'T00:00:00Z').toISOString();

        createUser({
            variables: {
                newUser: {
                    Name: firstName,
                    Surname: surname,
                    Password: password,
                    Gender: gender,
                    Email: email,
                    DOB: formattedDob
                }
            }
        }).catch(err => {
            console.log(err);
            toast.warning(err);
        }).then((_) => {
            // console.log(data);
            toast.success("Activation Email Sent!")
            navigate('/login', { replace: true });
        })
    }

    function isValidPassword(password: string): boolean {

        var char = false;
        var num = false;

        for (const a of password) {
            if (a.toLowerCase() >= "a" && a.toLowerCase() <= "z") {
                char = true;
            }

            if (a >= "0" && a <= "9") {
                num = true;
            }
        }

        if (char && num) {
            return true;
        }
        return false;

    }


    function isValidEmail(email: string): boolean {

        const validDomains = ["@gmail.com", "@yahoo.com", "@email"];
        const domainIndex = email.lastIndexOf("@");

        if (domainIndex === -1) {
            return false;
        }

        const domain = email.slice(domainIndex);
        if (!validDomains.includes(domain)) {
            return false;
        }

        return true;
    }

    function is17YearsOld(dateToCheck: string): boolean {
        const currentDate: any = new Date();
        const targetDate: any = new Date(dateToCheck);

        const timeDiffInMilliseconds = currentDate - targetDate;

        const yearsDiff = timeDiffInMilliseconds / (1000 * 60 * 60 * 24 * 365);

        return yearsDiff - 17 > 0;
    }

    return (
        <div className="container">
            <h1>FaREbook</h1>
            <div className="modal-container">
                <h3>Create a new account</h3>
                <h6>It's quick and easy.</h6>
                <hr />

                <div className="flex flex-col gap width">
                    <div className="flex gap
">
                        <input className="max-width text-box"
                            type="text" placeholder="First name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} value={firstName} />
                        <input className="max-width text-box"
                            type="text" placeholder="Surname" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSurname(e.target.value)} value={surname} />
                    </div>
                    <div>
                        <input className="max-width text-box"
                            type="email" placeholder="Email Address" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} value={email} />
                    </div>
                    <div>
                        <input className="max-width text-box"
                            type="password" placeholder="New Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} value={password} />
                    </div>
                    <div >
                        <h6 style={{ margin: "0" }}>Date of Birth</h6>
                        <input type="date" className="max-width text-box" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDob(e.target.value)} />
                    </div>
                    <div>
                        <h6 style={{ margin: "0" }}>Gender</h6>
                        <div className="flex justify-center gap">
                            <div className="flex items-center padding">
                                <input
                                    type="radio"
                                    id="male"
                                    name="gender"
                                    checked={gender === "male"}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setGender(e.target.value)
                                    }
                                    value="male"
                                />
                                <label className="radio-custom" htmlFor="male"></label>
                                <label className="radio-label" htmlFor="male">
                                    Male
                                </label>
                            </div>

                            <div className="flex items-center padding">
                                <input
                                    type="radio"
                                    id="female"
                                    name="gender"
                                    checked={gender === "female"}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setGender(e.target.value)
                                    }
                                    value="female"
                                />
                                <label className="radio-custom" htmlFor="female"></label>
                                <label className="radio-label" htmlFor="female">
                                    Female
                                </label>
                            </div>
                        </div>
                    </div>


                </div>
                <button onClick={handleRegister} className="mg-top btn">Sign Up</button>

                <Link to="/login" className="text-link">Already have an account?</Link>
            </div>
            <Footer /> 
        </div>
    )
}