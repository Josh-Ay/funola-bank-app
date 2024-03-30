import { Text } from "react-native"
import { useCardContext } from "../../contexts/CardContext";
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { CardServices } from "../../services/cardServices";
import AppLayout from "../../layouts/AppLayout/AppLayout";
import { View } from "react-native";
import { cardScreenStyles } from "../CardsScreen/cardStyles";
import { FlatList } from "react-native";
import FullCardItem from "../../components/FullCardItem/FullCardItem";
import { TouchableOpacity } from "react-native";
import { cardSettingStyles } from "./cardSettingsStyles";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../utils/colors";
import UserActionItem from "../../components/UserActionItem/UserActionItem";
import { cardItemActionsList } from "./utils";
import DepositItem from "../../components/DepositItem/DepositItem";
import { userItemActions } from "../../utils/utils";
import ModalOverlay from "../../layouts/AppLayout/components/ModalOverlay/ModalOverlay";
import { appLayoutStyles } from "../../layouts/AppLayout/styles";
import { fullSnapPoints } from "../../layouts/AppLayout/utils";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent";
import { getCurrencySymbol } from "../../utils/helpers";
import { useWalletContext } from "../../contexts/WalletContext";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useUserContext } from "../../contexts/UserContext";
import { UserServices } from "../../services/userServices";

const CardSettingsScreen = ({ navigation, route }) => {
    const {
        cards,
        setCards,
        cardsLoaded,
        setCardsLoaded,
        cardsLoading,
        setCardsLoading,
        setShowAddCardModal,
        cardTransactions,
        setCardTransactions,
    } = useCardContext();

    const {
        wallets,
        setWallets,
    } = useWalletContext();

    const {
        notifications,
        setNotifications,
    } = useUserContext();

    const [ refreshing, setRefreshing ] = useState(false);
    const toast = useToast();
    const [ currentSlide, setCurrentSlide ] = useState(0);
    const [ currentCardToDisplay, setCurrentCardToDisplay ] = useState(null);
    const sheetPanelRef = useRef();
    const [ sheetModalIsOpen, setSheetModalIsOpen ] = useState(false);
    const [ currentUserAction, setCurrentUserAction ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ itemToBeDebited, setItemToBeDebited ] = useState(null);
    const [ amount, setAmount ] = useState('0')
    const [ actionItemsLoading, setActionItemsLoading ] = useState([]);
    
    const cardListingRef = useRef();

    const [
        cardService,
        userService,
    ] = [
        new CardServices(),
        new UserServices(),
    ];
    
    const viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 50,
        waitForInteraction: true,
    }

    const onViewableItemsChanged = ({ viewableItems, changed }) => {
        setCurrentSlide(changed[0]?.index);
    };

    const viewabilityConfigCallbackPairs = useRef([
        { 
            viewabilityConfig,
            onViewableItemsChanged, 
        },
    ]);

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'normal',
            placement: 'top'
        })
    }

    const handleCloseBottomSheet = () => {
        setSheetModalIsOpen(false);
        setCurrentUserAction(null);
    }

    useEffect(() => {
        setRefreshing(false);

        if (!cardsLoaded) {
            setCardsLoading(true);

            cardService.getCardsDetail()
            .then((res) => {
                setCards(res?.data);
    
                setCardsLoading(false);
                setCardsLoaded(true);
            })
            .catch((err) => {
                const errorMsg = err.response ? err.response.data : err.message;
                showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your card details. Please refresh' : errorMsg, 'danger');
                setCardsLoading(false);
            })
        }

    }, [])

    useEffect(() => {
        if (!route?.params?.currentActiveCard) return

        const foundCardIndex = cards?.findIndex(card => card?._id === route?.params?.currentActiveCard?._id);
        if (foundCardIndex === -1) return

        setCurrentSlide(foundCardIndex);
        setCurrentCardToDisplay(route?.params?.currentActiveCard);
    }, [route])

    useEffect(() => {
        if (Array.isArray(cards) && cards[currentSlide]) return setCurrentCardToDisplay(cards[currentSlide]);

        setCurrentCardToDisplay(null);
    }, [currentSlide, cards])

    useEffect(() => {
        if (
            !currentCardToDisplay ||
            cardTransactions[currentCardToDisplay?._id]
        ) return

        const copyOfCardTransactions = {...cardTransactions};

        cardService.getCardTransactions(currentCardToDisplay?._id).then(res => {
            // console.log('Card transactions', res.data);
            copyOfCardTransactions[currentCardToDisplay?._id] = {
                transactions: res.data
            }
            setCardTransactions(copyOfCardTransactions);
        }).catch(err => {
            // console.log('Err fetching card transactions: ', err);
        })

    }, [currentCardToDisplay])

    useEffect(() => {

        if (!currentCardToDisplay) return

        const foundWalletMatchingCardCurrency = wallets?.find(wallet => wallet.currency === currentCardToDisplay?.currency);
        if (foundWalletMatchingCardCurrency) setItemToBeDebited(foundWalletMatchingCardCurrency);

    }, [sheetModalIsOpen, currentCardToDisplay])

    const handleRefresh = async () => {
        setRefreshing(true);
        setShowAddCardModal(false);

        try {
            const res = (await cardService.getCardsDetail()).data;
            setCards(res);

            setRefreshing(false);
            setCardsLoaded(true);
            setCardsLoading(false);

            console.log('refresh for cards done');
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            // console.log(errorMsg);

            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your card details. Please refresh' : errorMsg, 'danger');
            setRefreshing(false);
        }
    }

    const handleActionItemPress = async (action) => {
        if (sheetModalIsOpen) return

        // console.log(action);
        switch (action) {
            case userItemActions.cardFund:
                setCurrentUserAction(action);
                setSheetModalIsOpen(true);
                break;
            case userItemActions.cardHistory:
                navigation.navigate('Transactions', 
                    {
                        title: currentCardToDisplay?.cardName,
                        typeOfItem: 'card',
                        transactions: cardTransactions && cardTransactions[currentCardToDisplay?._id] && cardTransactions[currentCardToDisplay?._id]?.transactions ? cardTransactions[currentCardToDisplay?._id]?.transactions : [],
                    }
                )
                break;
            case userItemActions.cardSend:
                const copyOfActionItemsLoading = actionItemsLoading.slice();

                if (!copyOfActionItemsLoading.includes(userItemActions.cardSend)) {
                    copyOfActionItemsLoading.push(userItemActions.cardSend);
                    setActionItemsLoading(copyOfActionItemsLoading);
                }

                try {
                    const userHasTransactionPinSet = (await userService.checkTransactionPinStatus()).data;
                    setActionItemsLoading(actionItemsLoading.filter(item => item !== userItemActions.cardSend));
                    
                    navigation.navigate('SendFunds', {
                        itemType: 'card',
                        item: currentCardToDisplay,
                    })
                } catch (error) {
                    setActionItemsLoading(actionItemsLoading.filter(item => item !== userItemActions.cardSend));
                    showToastMessage(
                        error?.response?.status === 500 ?
                            'An error occured. Please try again later'
                        :
                        'Please set a transaction pin first in your profile page'
                    );
                }

                break;
            case userItemActions.cardRequest:
                navigation.navigate('RequestFunds', {
                    itemType: 'card',
                    item: currentCardToDisplay,
                })
                break;
            default:
                console.log(action);
                break;
        }
    } 

    const handleFundCard = async () => {
        
        if (
            amount.length < 1 || 
            isNaN(amount)
        ) return

        if (Number(amount) < 0.01) return showToastMessage('Please enter an amount greater than 0');

        setLoading(true);

        try {
            const res = (await cardService.fundCard({ amount, currency: currentCardToDisplay?.currency }, currentCardToDisplay._id)).data;

            const [
                copyOfAllTransactions,
                copyOfNotifications,
                copyOfCards,
                copyOfWallets,
            ] = [
                {...cardTransactions},
                notifications?.slice(),
                cards?.slice(),
                wallets?.slice(),
            ]

            const currentCardTransactions = copyOfAllTransactions[currentCardToDisplay?._id];

            if (!currentCardTransactions) {
                copyOfAllTransactions[currentCardToDisplay?._id] = {
                    transactions: [res?.newCardTransaction]
                }
            }
            
            if (currentCardTransactions) {
                copyOfAllTransactions[currentCardToDisplay?._id] = {
                    transactions: [
                        res?.newCardTransaction,
                        ...copyOfAllTransactions[currentCardToDisplay?._id]?.transactions,
                    ]
                }
            }

            setCardTransactions(copyOfAllTransactions);

            setNotifications([
                res?.notificationForCard,
                res?.notificationForWallet,
                ...copyOfNotifications
            ])

            const foundCardIndex = copyOfCards.findIndex(card => card._id === currentCardToDisplay?._id);
            if (foundCardIndex !== -1) {
                copyOfCards[foundCardIndex] = res?.updatedCardDetails;
                setCards(copyOfCards);
            }
            
            const foundWalletIndex = copyOfWallets.findIndex(wallet => wallet._id === itemToBeDebited?._id);
            if (foundWalletIndex !== -1) {
                copyOfWallets[foundWalletIndex] = res?.updatedDebitedWalletDetails;
                setWallets(copyOfWallets);
            }

            setLoading(false);
            setSheetModalIsOpen(false);
            
            showToastMessage(`Successfully added ${amount} ${currentCardToDisplay.currency} to card!`, 'success');

        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;

            setLoading(false);
            showToastMessage(errorMsg?.toLocaleLowerCase()?.includes('html') ? 'Something went wrong trying to fund your card. Please try again' : errorMsg, 'danger')
        }
    }

    return <>
        <AppLayout
            navigation={navigation}
            pageRefreshing={refreshing}
            handlePageRefresh={handleRefresh}
            sheetModalIsOpen={sheetModalIsOpen}
        >
            <View style={cardSettingStyles.topContentWrapper}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={cardSettingStyles.topContent}>
                    <Text style={cardSettingStyles.titleText}>Card Settings</Text>
                    <Text style={cardSettingStyles.subtitleText}>You can change quick links in settings</Text>
                    <View style={cardSettingStyles.cardActionsStyle}>
                        <FlatList
                            data={cardItemActionsList}
                            renderItem={
                                ({item}) => 
                                <UserActionItem 
                                    item={item} 
                                    handleItemPress={handleActionItemPress} 
                                    // style={{ marginRight: 30 }} 
                                    itemLoading={actionItemsLoading.includes(item.action)}
                                />
                            }
                            keyExtractor={item => item.id}
                            horizontal={true}
                            contentContainerStyle={{
                                justifyContent: 'space-between',
                                width: '100%',
                                paddingLeft: 8,
                                paddingRight: 8,
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={cardSettingStyles.contentWrapper}>
                <View style={cardSettingStyles.cardsTitleWrap}>
                    <Text style={cardSettingStyles.cardsTitleWrapText}>All Cards</Text>
                    <TouchableOpacity onPress={() => setShowAddCardModal(true)}>
                        <Text style={cardSettingStyles.cardsTitleWrapBtn}>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        cards?.length < 1 ?
                            <View style={cardScreenStyles.noCardWrapper}>
                                <Text style={cardScreenStyles.noCardsText}>You do not have any cards yet</Text> 
                            </View>
                        :
                        <FlatList
                            data={cards && Array.isArray(cards) ? cards : []}
                            renderItem={(listItem) => 
                                <FullCardItem
                                    card={listItem.item} 
                                    defaultBg={(listItem.index + 1) % 2 === 0 ? false : true} 
                                />
                            }
                            keyExtractor={(item) => {
                                return item._id
                            }}
                            horizontal
                            contentContainerStyle={Object.assign({}, cardScreenStyles.cardsListing, cardSettingStyles.cardsListing)}
                            pagingEnabled
                            viewabilityConfig={viewabilityConfig}
                            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                            // onViewableItemsChanged={handleViewableItemsChange}
                            showsHorizontalScrollIndicator={false}
                            ref={cardListingRef}
                            initialScrollIndex={currentSlide}
                            onScrollToIndexFailed={info => {
                                const scrollPromise = new Promise(resolve => setTimeout(resolve, 500));
                                scrollPromise.then(() => {
                                  cardListingRef.current?.scrollToIndex({ index: currentSlide, animated: true });
                                });
                            }}
                        />
                    }
                </View>
                {
                    cards?.length < 1 ?
                        <></> 
                    :
                    <View style={cardScreenStyles.cardsIndicatorWrapper}>
                        {
                            React.Children.toArray(
                                cards?.map((item, index) => {
                                    return <View 
                                        style={
                                            currentSlide === index ? 
                                                Object.assign({}, cardScreenStyles.cardIndicator, cardScreenStyles.activeCardIndicator) 
                                            : 
                                            cardScreenStyles.cardIndicator
                                        }
                                    ></View>
                                })
                            )
                        }
                    </View>
                }

                <View style={cardSettingStyles.cardsTitleWrap}>
                    <Text style={cardSettingStyles.cardsTitleWrapText}>Recent Transactions</Text>
                    {
                        cardTransactions[currentCardToDisplay?._id] && cardTransactions[currentCardToDisplay?._id]?.transactions?.length > 0 &&
                        <TouchableOpacity
                            onPress={
                                () => navigation.navigate('Transactions', 
                                    {
                                        title: currentCardToDisplay?.cardName,
                                        typeOfItem: 'card',
                                        transactions: cardTransactions && cardTransactions[currentCardToDisplay?._id] && cardTransactions[currentCardToDisplay?._id]?.transactions ? cardTransactions[currentCardToDisplay?._id]?.transactions : [],
                                    }
                                )
                            }
                        >
                            <Text style={cardSettingStyles.cardsTitleWrapBtn}>All</Text>
                        </TouchableOpacity>
                    }
                </View>

                {
                    !cardTransactions[currentCardToDisplay?._id] ? <Text style={cardSettingStyles.infoText}>Loading transactions...</Text>
                    :
                    cardTransactions[currentCardToDisplay?._id]?.transactions?.length < 1 ? <Text style={cardSettingStyles.infoText}>You have not made any transactions with this card yet</Text>
                    :
                    <View style={cardSettingStyles.transactionItemWrapper}>
                        <View style={cardSettingStyles.transactionItemWrap}>
                            {
                                React.Children.toArray(cardTransactions[currentCardToDisplay?._id]?.transactions?.slice(0, 5)?.map(transaction => {
                                    return <>
                                        <DepositItem 
                                            transaction={transaction}
                                            isTransaction={true}
                                            handleTransactionClick={
                                                () => navigation.navigate('SingleTransaction', 
                                                    { 
                                                        transactionItem: transaction,
                                                    }
                                                )
                                            }
                                        />
                                    </>
                                }))
                            }
                        </View>
                    </View>
                }

            </View>

            {/* CARD SETTINGS PAGE SHEET MODAL */}
            {
                sheetModalIsOpen && 
                <ModalOverlay
                    handleClickOutside={handleCloseBottomSheet}
                >
                    <BottomSheet
                        ref={sheetPanelRef}
                        snapPoints={
                            fullSnapPoints
                        }
                        style={appLayoutStyles.modalWrapper}
                        enablePanDownToClose={true}
                        onClose={handleCloseBottomSheet}
                    >
                        <BottomSheetView style={appLayoutStyles.modalContainer}>
                            <View style={cardSettingStyles.modalContentWrapper}>
                                <Text style={cardSettingStyles.modalTitle}>Fund Card</Text>

                                <View style={appLayoutStyles.modalInputItemWrapper}>
                                    <Text style={appLayoutStyles.modalInputHeaderText}>Amount</Text>
                                    <TextInputComponent
                                        name={'amount'}
                                        value={amount}
                                        handleInputChange={(name, value) => setAmount(value)}
                                        isEditable={!loading}
                                        isNumericInput={true}
                                    />
                                </View>

                                <View style={appLayoutStyles.modalInputItemWrapper}>
                                    <Text style={appLayoutStyles.modalInputHeaderText}>Wallet Being Debited</Text>
                                    {
                                        !itemToBeDebited ? 
                                            <Text style={{...appLayoutStyles.modalInputHeaderText, ...appLayoutStyles.modalWarningText }}>You do not have a {currentCardToDisplay?.currency} wallet to initiate this transaction.</Text>

                                        :
                                        <Text style={{...appLayoutStyles.modalInputHeaderText, ...appLayoutStyles.modalInfoText }}>Your {currentCardToDisplay?.currency} wallet: {getCurrencySymbol(currentCardToDisplay?.currency)}{Number(itemToBeDebited?.balance).toFixed(2)}</Text>
                                    }
                                </View>

                                {
                                    itemToBeDebited && 
                                    <CustomButton
                                        buttonText={
                                            loading ? 'Please wait...'
                                            :
                                            'Fund'
                                        }
                                        btnStyle={
                                            loading ?
                                                Object.assign({}, appLayoutStyles.modalBtnStyle, appLayoutStyles.disabledModalBtn)
                                            :
                                            {
                                                ...appLayoutStyles.modalBtnStyle 
                                            }
                                        }
                                        textContentStyle={
                                            appLayoutStyles.modalBtnTextStyle
                                        }
                                        handleBtnPress={() => handleFundCard()}
                                        disabled={
                                            loading ? 
                                                true 
                                            :
                                            false
                                        }
                                    />
                                }
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                </ModalOverlay>
            }
        </AppLayout>
    </>
}

export default CardSettingsScreen;