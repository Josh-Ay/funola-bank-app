import React, { useContext, useState } from "react";

const DepositContext = React.createContext({});

export const useDepositContext = () => useContext(DepositContext);

const initialNewDepositState = {
    currency: '',
    duration: '', 
    rate: '',
    depositAmount: '',
    paymentMethod: '',
}

export default DepositContextProvider = ({ children }) => {
    const [ deposits, setDeposits] = useState([]);
    const [ depositsLoaded, setDepositsLoaded ] = useState(false);
    const [ depositsLoading, setDepositsLoading ] = useState(true);
    const [ showAddDepositModal, setShowAddDepositModal ] = useState(false);
    const [ newDepositDetails, setNewDepositDetails ] = useState(initialNewDepositState);

    const handleUpdateNewDepositDetails = (keyToUpdate, valueToUpdateTo) => {
        setNewDepositDetails((prevDetails) => {
            return {
                ...prevDetails,
                [keyToUpdate]: valueToUpdateTo
            }
        })
    }

    const resetNewDepositDetailState = () => {
        setNewDepositDetails(initialNewDepositState);
    }

    return <>
        <DepositContext.Provider
            value={{ 
                deposits,
                setDeposits,
                depositsLoaded,
                setDepositsLoaded,
                depositsLoading, 
                setDepositsLoading,
                showAddDepositModal,
                setShowAddDepositModal,
                newDepositDetails,
                handleUpdateNewDepositDetails,
                resetNewDepositDetailState,
            }}
        >
            { children }
        </DepositContext.Provider>
    </>
}