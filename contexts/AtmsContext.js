import React, { useContext, useState } from "react";

const AtmContext = React.createContext({});

export const useAtmContext = () => useContext(AtmContext);

export default AtmContextProvider = ({ children }) => {
    const [ atms, setAtms ] = useState([]);
    const [ atmsLoading, setAtmsLoading ] = useState(true);
    const [ atmsLoaded, setAtmsLoaded ] = useState(false);

    return <>
        <AtmContext.Provider
            value={{
                atms,
                setAtms,
                atmsLoading,
                setAtmsLoading,
                atmsLoaded,
                setAtmsLoaded,
            }}
        >
            { children }
        </AtmContext.Provider>
    </>
}