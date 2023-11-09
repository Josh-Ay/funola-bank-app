import React, { useContext, useState } from "react";

const CardContext = React.createContext({});

export const useCardContext = () => useContext(CardContext);

const initialNewCardState = {
    currency: '',
    cardName: '', 
    paymentNetwork: '',
}

export default CardContextProvider = ({ children }) => {

    const [ cards, setCards ] = useState([]);
    const [ cardsLoaded, setCardsLoaded ] = useState(false);
    const [ cardsLoading, setCardsLoading ] = useState(true);
    const [ showAddCardModal, setShowAddCardModal ] = useState(false);
    const [ newCardDetails, setNewCardDetails ] = useState(initialNewCardState);
    const [ cardTransactions, setCardTransactions ] = useState({});

    const handleUpdateNewCardDetails = (keyToUpdate, valueToUpdateTo) => {
        setNewCardDetails((prevDetails) => {
            return {
                ...prevDetails,
                [keyToUpdate]: valueToUpdateTo
            }
        })
    }

    const resetNewCardDetailState = () => {
        setNewCardDetails(initialNewCardState);
    }
    
    return <>
        <CardContext.Provider
            value={{ 
                cards,
                setCards,
                cardsLoaded,
                setCardsLoaded,
                cardsLoading,
                setCardsLoading,
                showAddCardModal,
                setShowAddCardModal,
                newCardDetails,
                handleUpdateNewCardDetails,
                resetNewCardDetailState,
                cardTransactions,
                setCardTransactions,
            }}
        >
            { children }
        </CardContext.Provider>
    </>
}