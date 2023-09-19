import { createContext, useContext, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { getUser, validateToken, validateeToken } from "../apollo/query";
import { toast } from "react-toastify";

type UserType = {
    id: string;
    name: string;
    surname: string;
    email: string;
    dob: string;
    gender: string;
    home: string;
    profile: string;
}

const AuthContext = createContext<{
    user: UserType;
    setUser: React.Dispatch<React.SetStateAction<UserType>>;
}>({
    user: {
        id: "",
        name: "",
        surname: "",
        email: "",
        dob: "",
        gender: "",
        home: "",
        profile: "",
    },
    setUser: () => { },
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<UserType>({
        id: "",
        name: "",
        surname: "",
        email: "",
        dob: "",
        gender: "",
        home: "",
        profile: "",
    });

    const [validate_token] = useLazyQuery(validateeToken);
    const [get_user] = useLazyQuery(getUser);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("jwt")) {
            navigate("/login", { replace: true });
        } else {
            const jwtToken = localStorage.getItem("jwt");
    
            validate_token({
                variables: {
                    token: jwtToken,
                },
            })
            .then(validateTokenResult => {
                console.log(validateTokenResult);
                if (!validateTokenResult?.data?.validateeToken) {
                    toast.warning("Please Login Again!");
                    navigate("/login", { replace: true });
                } else {
                    get_user()
                        .then(data => {
                            const userData = data?.data?.getUser;
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
                        })
                        .catch(err => {
                            console.log("ERROR: " + err);
                        });
                }
            })
            .catch(validateTokenError => {
                console.log(validateTokenError);
            });
        }
    }, []);    

    const value = {
        user,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
