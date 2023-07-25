import React, { useContext, useState } from "react";

const UserContext = React.createContext({});

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);

    return <UserContext.Provider value={{
        currentUser,
        setCurrentUser,
    }}>
        { children }
    </UserContext.Provider>
}