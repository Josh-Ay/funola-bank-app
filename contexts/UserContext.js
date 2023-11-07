import React, { useContext, useState } from "react";

const UserContext = React.createContext({});

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ userProfileLoading, setUserProfileLoading ] = useState(true);
    const [ userProfileLoaded, setUserProfileLoaded ] = useState(false);
    const [ notifications, setNotifications ] = useState([]);
    const [ otherUsers, setOtherUsers ] = useState([]);
    const [ allOtherUserDataLoaded, setAllOtherUserDataLoaded ] = useState(false);
    const [ allOtherUserDataLoading, setAllOtherUserDataLoading ] = useState(true);

    return <UserContext.Provider value={{
        currentUser,
        setCurrentUser,
        userProfileLoaded,
        setUserProfileLoaded,
        notifications,
        setNotifications,
        otherUsers,
        setOtherUsers,
        allOtherUserDataLoaded,
        setAllOtherUserDataLoaded,
        userProfileLoading,
        setUserProfileLoading,
        allOtherUserDataLoading,
        setAllOtherUserDataLoading,
    }}>
        { children }
    </UserContext.Provider>
}