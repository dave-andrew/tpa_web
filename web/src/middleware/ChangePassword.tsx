import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom"
import { validateToken } from "../apollo/query";
import { useState } from "react";


export default function ChangePassword({ children }: {children: JSX.Element}) {

    const navigate = useNavigate();

    const [value, setValue] = useState<boolean>(false);

    const { token } = useParams();
    const { loading } = useQuery(validateToken, {
        variables: {
            token: token
        }, onCompleted: (data) => {
            console.log(data);
            if(data.validateToken){
                setValue(true);     
            }else{
                navigate("/", {replace: true})
            }
        }, onError: (_) => {
            navigate("/login", {replace: true})
        }
    });

    if(loading){
        return <div>Loading...</div>
    }

    return (
        <div>
            {children}
        </div>
    )
}