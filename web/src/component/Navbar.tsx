import { Link } from "react-router-dom"
import "./Navbar.css"


export default function Navbar() {

    return (
        <div className="nav">
            <div>
                <img src="fb.png" alt="" className="icon" />
            </div>
            <div className="max-width flex flex-end align-center">
                <input type="text" placeholder="Email" className="input-box"/>
                <input type="password" placeholder="Password" className="input-box"/>
                <button className="btn-blue mr-10">Log In</button>
                <Link to="/recover" className="text-small mr-15">Forgotten account?</Link>
            </div>
        </div>
    )
}