import { RefreshControl, ScrollView, Text, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { appLayoutStyles } from "./styles";
import { useRoute } from "@react-navigation/native";
import CustomDropdownItem from "../../components/DropdownItemComponent/CustomDropdownItem";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useWalletContext } from "../../contexts/WalletContext";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useDepositContext } from "../../contexts/DepositContext";
import { useCardContext } from "../../contexts/CardContext";
import { useToast } from "react-native-toast-notifications";
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent";
import { CardServices } from "../../services/cardServices";
import { WalletServices } from "../../services/walletServices";
import { DepositServices } from "../../services/depositServices";
import { validFunolaCardPaymentNetworks, validFunolaCurrencies, validFunolaDurations, validFunolaPaymentMethods, validFunolaRates } from "../../utils/utils";
import { handleAPICallAndSubsequentStateUpdate } from "./apiHelper";
import { fullSnapPoints, miniSnapPoints } from "./utils";
import SingleWalletItem from "./components/SingleWalletItem/SingleWalletItem";
import BottomNavigationBar from "../../components/BottomNavigationBar/BottomNavigationBar";
import ModalOverlay from "./components/ModalOverlay/ModalOverlay";
import { SafeAreaView } from "react-native-safe-area-context";


const AppLayout = ({ 
    navigation, 
    children, 
    pageRefreshing, 
    handlePageRefresh,
    handleSelectWallet,
    currentActiveWallet,
    sheetModalIsOpen,
}) => {

    const Route = useRoute();
    const sheetPanelRef = useRef(null);
    const toast = useToast();
    const [ modalIsOpen, setModalIsOpen ] = useState(false);
    const [ btnDisabled, setBtnDisabled ] = useState(false);

    const {
        showAddWalletModal,
        setShowAddWalletModal,
        newWalletDetails,
        handleUpdateNewWalletDetails,
        resetNewWalletDetailState,
        showAllWalletsModal,
        setShowAllWalletsModal,
        wallets,
        setWallets,
    } = useWalletContext()

    const {
        showAddDepositModal,
        setShowAddDepositModal,
        newDepositDetails,
        handleUpdateNewDepositDetails,
        resetNewDepositDetailState,
        deposits,
        setDeposits,
    } = useDepositContext()

    const {
        showAddCardModal,
        setShowAddCardModal,
        newCardDetails,
        handleUpdateNewCardDetails,
        cards,
        setCards,
        resetNewCardDetailState,
    } = useCardContext()

    const cardService = new CardServices();
    const walletService = new WalletServices();
    const depositService = new DepositServices();

    useEffect(() => {
        if (!modalIsOpen) {
            setShowAddWalletModal(false);
            setShowAddCardModal(false);
            setShowAddDepositModal(false);
            setShowAllWalletsModal(false);
            return
        }
    }, [modalIsOpen])

    useEffect(() => {
        if (
            showAddWalletModal ||
            showAddCardModal ||
            showAddDepositModal ||
            showAllWalletsModal
        ) {
            setModalIsOpen(true);
            handleSnapPress();
            return
        }

        setModalIsOpen(false);

    }, [showAddWalletModal, showAddDepositModal, showAddCardModal, showAllWalletsModal])

    const handleSnapPress = useCallback(() => {
        sheetPanelRef.current?.snapToIndex(0);
    }, [])

    const handleNavigationItemPress = (routeToGoTo) => {
        if (!navigation || !navigation.navigate) return

        navigation.navigate(routeToGoTo);
    }

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'info',
            placement: 'top'
        })
    }

    const handleCloseBottomSheet = () => {
        setModalIsOpen(false);

        if (btnDisabled) return
        
        resetNewCardDetailState();
        resetNewDepositDetailState();
        resetNewWalletDetailState();
    }

    const handleWalletClick = (indexPassed) => {
        handleSelectWallet(indexPassed);
        handleCloseBottomSheet();
    }

    const handleAddAdditionalWallet = () => {
        setShowAllWalletsModal(false);
        setShowAddWalletModal(true);
    }

    const closeBottomSheetAndEnableSheetBtn = () => {
        handleCloseBottomSheet();
        setBtnDisabled(false);
    }

    const handleCreateNewWallet = async () => {
        if (newWalletDetails.currency.length < 1) return showToastMessage('Please select a currency', 'normal');

        setBtnDisabled(true);

        await handleAPICallAndSubsequentStateUpdate(
            walletService.createNewWallet,
            newWalletDetails,
            wallets.slice(),
            setWallets,
            () => {
                closeBottomSheetAndEnableSheetBtn();
                showToastMessage('Successfully created new wallet!', 'success');
            },
            (message) => {
                showToastMessage(message, 'danger');
                setBtnDisabled(false);
            },
            null,
            false,
        )
    }

    const handleCreateNewCard = async () => {

        if (newCardDetails.cardName.length < 1) return showToastMessage('Please enter a name for your card', 'normal');
        if (newCardDetails.currency.length < 1) return showToastMessage('Please select a currency', 'normal');
        if (newCardDetails.paymentNetwork.length < 1) return showToastMessage('Please select a card type', 'normal');

        setBtnDisabled(true);

        await handleAPICallAndSubsequentStateUpdate(
            cardService.createNewCard,
            newCardDetails,
            cards.slice(),
            setCards,
            () => {
                closeBottomSheetAndEnableSheetBtn();
                showToastMessage('Successfully created new card!', 'success');
            },
            (message) => {
                showToastMessage(message, 'danger');
                setBtnDisabled(false);
            },
            'virtual',
            false,
        )
    }

    const handleCreateNewDeposit = async () => {
        if (newDepositDetails.currency.length < 1) return showToastMessage('Please select a currency', 'normal');
        if (newDepositDetails.depositAmount.length < 1) return showToastMessage('Please enter a deposit amount', 'normal');
        if (newDepositDetails.rate.length < 1) return showToastMessage('Please select a rate for your deposit', 'normal');
        if (newDepositDetails.duration.length < 1) return showToastMessage('Please select a duration for your deposit', 'normal');
        if (newDepositDetails.paymentMethod.length < 1) return showToastMessage('Please select a payment method', 'normal');

        const currentCards = cards.slice();
        const currentWallets = wallets.slice();
        const foundCardDebitedIndex = currentCards.findIndex(card => card.currency === newDepositDetails.currency);
        const foundWalletDebitedIndex = currentWallets.findIndex(wallet => wallet.currency === newDepositDetails.currency);

        setBtnDisabled(true);

        await handleAPICallAndSubsequentStateUpdate(
            depositService.createNewDeposit,
            newDepositDetails,
            deposits.slice(),
            setDeposits,
            () => {
                closeBottomSheetAndEnableSheetBtn();
                showToastMessage('Successfully added new deposit!', 'success');

                if (newDepositDetails.paymentMethod === 'card' && foundCardDebitedIndex !== -1) {
                    currentCards[foundCardDebitedIndex].balance -= Number(newDepositDetails.depositAmount);
                    setCards(currentCards);
                }
    
                if (newDepositDetails.paymentMethod === 'wallet' && foundWalletDebitedIndex !== -1) {
                    currentWallets[foundWalletDebitedIndex].balance -= Number(newDepositDetails.depositAmount);
                    setWallets(currentWallets);
                }
            },
            (message) => {
                showToastMessage(message, 'danger');
                setBtnDisabled(false);
            },
            null,
            true,
        )
    }

    return <>
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView 
                style={
                    modalIsOpen ?
                        Object.assign({}, appLayoutStyles.mainContent, appLayoutStyles.overlayContent)
                    :
                    appLayoutStyles.mainContent
                }
                refreshControl={
                    <RefreshControl 
                        refreshing={pageRefreshing} 
                        onRefresh={handlePageRefresh} 
                    />
                }
            >
                {children}
            </ScrollView>

            {
                sheetModalIsOpen ? <></> :
                <BottomNavigationBar 
                    applayoutModalIsOpen={modalIsOpen}
                    currentRouteName={Route.name}
                    handleNavItemPress={handleNavigationItemPress}
                />
            }
            

            {/* BOTTOM SHEET MODAL */}
            {
                modalIsOpen && 
                <ModalOverlay handleClickOutside={handleCloseBottomSheet}>
                    <BottomSheet 
                        ref={sheetPanelRef}
                        snapPoints={
                            showAddWalletModal ?
                                miniSnapPoints
                            :
                            fullSnapPoints
                        }
                        style={appLayoutStyles.modalWrapper}
                        enablePanDownToClose={true}
                        onClose={handleCloseBottomSheet}
                    >
                        <BottomSheetView style={appLayoutStyles.modalContainer}>
                            {
                                showAddWalletModal ? <>
                                    <Text style={appLayoutStyles.modalTitleText}>Create new wallet</Text>
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Currency</Text>
                                        <CustomDropdownItem
                                            hasDropdownItems={true}
                                            dropdownItems={validFunolaCurrencies}
                                            extractKey={'currency'}
                                            content={newWalletDetails.currency}
                                            handleItemSelect={(selectedVal) => handleUpdateNewWalletDetails('currency', selectedVal.currency)}
                                            contentHasLoaded={true}
                                            style={appLayoutStyles.modalSelectItem}
                                            placeholderText={'Select currency'}
                                            dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                        />
                                    </View>
                                </>
                                :
                                showAddDepositModal ? <>
                                    <Text style={appLayoutStyles.modalTitleText}>Create new deposit</Text>
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Amount</Text>
                                        <TextInputComponent 
                                            value={newDepositDetails.depositAmount}
                                            name={'depositAmount'}
                                            handleInputChange={(name, val) => handleUpdateNewDepositDetails(name, val)}
                                            placeholder={'10'}
                                            isNumericInput={true}
                                        />
                                    </View>
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Currency</Text>
                                        <CustomDropdownItem
                                            hasDropdownItems={true}
                                            dropdownItems={validFunolaCurrencies}
                                            extractKey={'currency'}
                                            content={newDepositDetails.currency}
                                            handleItemSelect={(selectedVal) => handleUpdateNewDepositDetails('currency', selectedVal.currency)}
                                            contentHasLoaded={true}
                                            style={appLayoutStyles.modalSelectItem}
                                            placeholderText={'Select currency'}
                                            dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                        />
                                    </View>
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Returns Rate (%)</Text>
                                        <CustomDropdownItem
                                            hasDropdownItems={true}
                                            dropdownItems={validFunolaRates}
                                            extractKey={'rate'}
                                            content={newDepositDetails.rate}
                                            handleItemSelect={(selectedVal) => handleUpdateNewDepositDetails('rate', selectedVal.rate)}
                                            contentHasLoaded={true}
                                            style={appLayoutStyles.modalSelectItem}
                                            placeholderText={'Select rate'}
                                            dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                        />
                                    </View>
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Duration of Deposit (months)</Text>
                                        <CustomDropdownItem
                                            hasDropdownItems={true}
                                            dropdownItems={validFunolaDurations}
                                            extractKey={'duration'}
                                            content={newDepositDetails.duration}
                                            handleItemSelect={(selectedVal) => handleUpdateNewDepositDetails('duration', selectedVal.duration)}
                                            contentHasLoaded={true}
                                            style={appLayoutStyles.modalSelectItem}
                                            placeholderText={'Select duration'}
                                            dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                        />
                                    </View>
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Payment Method</Text>
                                        <CustomDropdownItem
                                            hasDropdownItems={true}
                                            dropdownItems={validFunolaPaymentMethods}
                                            extractKey={'method'}
                                            content={newDepositDetails.paymentMethod}
                                            handleItemSelect={(selectedVal) => handleUpdateNewDepositDetails('paymentMethod', selectedVal.method)}
                                            contentHasLoaded={true}
                                            style={appLayoutStyles.modalSelectItem}
                                            placeholderText={'Select payment method'}
                                            dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                        />
                                    </View>
                                </>
                                :
                                showAddCardModal ? <>
                                    <Text style={appLayoutStyles.modalTitleText}>Create new card</Text>
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Name on Card</Text>
                                        <TextInputComponent 
                                            value={newCardDetails.cardName}
                                            name={'cardName'}
                                            handleInputChange={(name, val) => handleUpdateNewCardDetails(name, val)}
                                            placeholder={'JOHN DOE'}
                                        />
                                    </View>
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Card type</Text>
                                        <CustomDropdownItem
                                            hasDropdownItems={true}
                                            dropdownItems={validFunolaCardPaymentNetworks}
                                            extractKey={'network'}
                                            content={newCardDetails.paymentNetwork}
                                            handleItemSelect={(selectedVal) => handleUpdateNewCardDetails('paymentNetwork', selectedVal.network)}
                                            contentHasLoaded={true}
                                            style={appLayoutStyles.modalSelectItem}
                                            placeholderText={'Select card type'}
                                            dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                        />
                                    </View>
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Currency</Text>
                                        <CustomDropdownItem
                                            hasDropdownItems={true}
                                            dropdownItems={validFunolaCurrencies}
                                            extractKey={'currency'}
                                            content={newCardDetails.currency}
                                            handleItemSelect={(selectedVal) => handleUpdateNewCardDetails('currency', selectedVal.currency)}
                                            contentHasLoaded={true}
                                            style={appLayoutStyles.modalSelectItem}
                                            placeholderText={'Select currency'}
                                            dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                        />
                                    </View>
                                </>
                                :
                                showAllWalletsModal ?
                                <>
                                    <Text style={appLayoutStyles.modalTitleText}>Wallets</Text>
                                    <View>
                                        {
                                            React.Children.toArray(wallets.map((wallet, index) => {
                                                return <SingleWalletItem 
                                                    wallet={wallet}
                                                    walletIndex={index}
                                                    currentActiveWallet={currentActiveWallet}
                                                    handleWalletItemClick={handleWalletClick}
                                                />
                                            }))
                                        }
                                    </View>
                                </>
                                :
                                <></>
                            }

                            <CustomButton 
                                buttonText={
                                    btnDisabled ? 'Please wait...'
                                    :
                                    showAllWalletsModal ?
                                    'Create new'
                                    :
                                    'Create'
                                }
                                btnStyle={
                                    btnDisabled ?
                                        Object.assign({}, appLayoutStyles.modalBtnStyle, appLayoutStyles.disabledModalBtn)
                                    :
                                    showAllWalletsModal ?
                                        Object.assign({}, appLayoutStyles.modalBtnStyle, appLayoutStyles.modalAddWalletBtnStyle)
                                    :
                                    appLayoutStyles.modalBtnStyle
                                }
                                textContentStyle={
                                    showAllWalletsModal ?
                                        Object.assign({}, appLayoutStyles.modalBtnTextStyle, appLayoutStyles.modalBlueBtnTextStyle)
                                    :
                                    appLayoutStyles.modalBtnTextStyle
                                }
                                handleBtnPress={
                                    showAddWalletModal ?
                                        () => handleCreateNewWallet()
                                    :
                                    showAddCardModal ?
                                        () => handleCreateNewCard()
                                    :
                                    showAddDepositModal ?
                                        () => handleCreateNewDeposit()
                                    :
                                    showAllWalletsModal ?
                                        () => handleAddAdditionalWallet()
                                    :
                                    () => {}
                                }
                                disabled={btnDisabled}
                            />
                            
                        </BottomSheetView>
                    </BottomSheet>
                </ModalOverlay>
            }
        </SafeAreaView>
    </>
}

export default AppLayout;
