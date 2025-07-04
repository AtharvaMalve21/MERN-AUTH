import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const URI = import.meta.env.VITE_BACKEND_URI;

    const value = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn
    }

    const fetchUserDetails = async () => {
        try {
            const { data } = await axios.get(URI + "/api/v1/user/profile", { withCredentials: true });


            console.log(data.data);
            if (data.success) {
                setUser(data.data);
                setIsLoggedIn(true);
                // toast.success(data.message);
            }

        } catch (err) {
            // toast.error(err.response.data.message);
            console.log(err.response.data.message)
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, [isLoggedIn]);

    return (
        <UserContext.Provider value={value} >
            {children}
        </UserContext.Provider>
    )
}

