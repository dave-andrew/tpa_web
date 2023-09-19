import { useQuery } from "@apollo/client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { validate_email } from "../apollo/query";
import { useEffect } from "react"
import { toast } from "react-toastify";

export default function VerifyEmail() {
    const { token } = useParams();
    const { loading, data, error } = useQuery(validate_email, {
        variables: {
            token: token
        }
    });

    const navigate = useNavigate();
    
    useEffect(() => {
        if (data) {
            console.log(data);
        }
        if (error) {
            // console.log(error);
            toast.success("Email Verified, Please Login to Proceed!")
            navigate("/login", { replace: true });
        }
    }, [data, navigate]);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{fontWeight: "bold", fontSize: "40px"}}>
                Verify Email Success
            </div>
            <Link to={"/login"} style={{cursor: "pointer"}}>Redirect to Home Page</Link>
        </div>
    );
}
