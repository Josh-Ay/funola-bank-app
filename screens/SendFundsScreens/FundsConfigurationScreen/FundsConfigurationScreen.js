import { FlatList, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../utils/colors";
import { configureFundStyles } from "./configureFundStyles";
import { View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { AntDesign } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import React, { useEffect, useRef, useState } from "react";
import QuickFundItem from "./components/QuickFundItem";
import { quickFundsOptions, validTransferOptions } from "./utils/utils";
import NavigationTabFilterItem from "../../../components/NavigationTabFilterItem/NavigationTabFilterItem";
import SingleWalletItem from "../../../layouts/AppLayout/components/SingleWalletItem/SingleWalletItem";
import { useWalletContext } from "../../../contexts/WalletContext";
import { useCardContext } from "../../../contexts/CardContext";
import CardItem from "../../../components/CardItem/Carditem";
import { ConvertServices } from "../../../services/convertServices";
import { useToast } from "react-native-toast-notifications";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import ModalOverlay from "../../../layouts/AppLayout/components/ModalOverlay/ModalOverlay";
import { miniSnapPoints } from "../../../layouts/AppLayout/utils";
import { appLayoutStyles } from "../../../layouts/AppLayout/styles";
import { StackActions } from "@react-navigation/native";
import { getCurrencySymbol } from "../../../utils/helpers";

const FundsConfigurationScreen = ({ navigation, route }) => {
    const initialAmount = '10';
    const [ amountToSend, setAmountToSend ] = useState(initialAmount);
    const [ currency, setCurrency ] = useState('');
    const [ showWallets, setShowWallets ] = useState(true);
    const [ itemToBeDebited, setItemToBeDebited ] = useState(null);
    const [ sheetModalIsOpen, setSheetModalIsOpen ] = useState(false);
    const [ transferType, setTransferType ] = useState(null);
    const [ receiver, setReceiver ] = useState(null);
    const [ remarks, setRemarks ] = useState('');

    const sheetPanelRef = useRef();
    const {
        wallets
    } = useWalletContext();
    const {
        cards
    } = useCardContext();

    const toast = useToast();

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'info',
            placement: 'top'
        })
    }

    useEffect(() => {

        const { type, receiverDetail } = route?.params;
        if (
            !type ||
            !receiverDetail ||
            !validTransferOptions.includes(type)
        ) {
            navigation.dispatch(
                StackActions.replace('SendFunds')
            )
            return
        }

        setTransferType(type);
        setReceiver(receiverDetail);
        
        if (wallets.length > 0 && Array.isArray(wallets) && !itemToBeDebited) setItemToBeDebited(wallets[0])

    }, [])

    useEffect(() => {
        const previousCurrency = currency;

        setCurrency(itemToBeDebited?.currency);

        if (previousCurrency !== itemToBeDebited?.currency) {
            const convertService = new ConvertServices();
            convertService.getCurrencyRate(Number(amountToSend), previousCurrency, itemToBeDebited?.currency).then(res => {
                // console.log(res.data);
                setAmountToSend(`${Number(res.data?.value).toFixed(2)}`);
            }).catch(err => {
                // console.log(err?.response?.data);
            })
        }

    }, [itemToBeDebited])

    const handleCloseBottomSheet = () => {
        setSheetModalIsOpen(false);
    }

    const handleSendFund = () => {
        if (!amountToSend || amountToSend.length < 1 || isNaN(amountToSend)) return

        const amountToSendAsNum = Number(amountToSend);

        if (amountToSendAsNum < 0.01) return

        if (amountToSendAsNum > Number(itemToBeDebited?.balance)) {
            showToastMessage('You do not have sufficient funds to initiate this transaction')
            return
        }

        navigation.navigate(
            'FundsConfirmation',
            {
                amount: amountToSendAsNum,
                transferType,
                receiver,
                itemToBeDebited,
                remarks,
                isRecent: route?.params?.isRecent,
            }
        )
    }

    return <>
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.paleBlue }} behavior='padding'>
            <View style={configureFundStyles.topContentWrapper}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={configureFundStyles.topContent}>
                    <Text style={configureFundStyles.titleText}>Send money</Text>
                    <Text style={configureFundStyles.subtitleText}>How much will you like to send?</Text>
                    
                </View>
            </View>

            <ScrollView style={configureFundStyles.contentWrapper}>
                <View style={configureFundStyles.selectAmount}>
                    <Text style={configureFundStyles.itemContentTitle}>
                        Transfer amount
                    </Text>

                    <View style={configureFundStyles.amountTextWrap}>
                        <TouchableOpacity 
                            onPress={
                                Number(amountToSend) - 100 >= 100 ? 
                                    () => setAmountToSend(`${Number(amountToSend) - 100}`)
                                :
                                () => {}
                            }
                            style={configureFundStyles.amountBtn}
                        >
                            <AntDesign name="minus" size={24} color={colors.grey} />
                        </TouchableOpacity>
                        <View style={configureFundStyles.amountTextDetailWrap}>
                            <Text style={configureFundStyles.amountText}>
                                {
                                    getCurrencySymbol(itemToBeDebited?.currency)
                                }
                            </Text>
                            <TextInputComponent 
                                value={amountToSend}
                                style={configureFundStyles.amountText}
                                handleInputChange={(name, val) => setAmountToSend(val)}
                                isNumericInput={true}
                                returnKeyType={'done'}
                                disableFocusStyle={true}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={
                                Number(amountToSend) + 100 <= 1000 ? 
                                    () => setAmountToSend(`${Number(amountToSend) + 100}`)
                                :
                                () => {}
                            }
                            style={configureFundStyles.amountBtn}
                        >
                            <AntDesign name="plus" size={24} color={colors.grey} />
                        </TouchableOpacity>
                    </View>
                    <Slider
                        style={configureFundStyles.slider}
                        minimumValue={100}
                        maximumValue={1000}
                        minimumTrackTintColor={colors.blue}
                        maximumTrackTintColor={colors.grey}
                        thumbTintColor={colors.blue}
                        value={amountToSend}
                        onValueChange={(val) => setAmountToSend(`${val}`)}
                        step={100}
                        lowerLimit={100}
                        upperLimit={1000}
                    />
                    <FlatList
                        data={quickFundsOptions}
                        renderItem={
                            ({item}) => 
                                <QuickFundItem 
                                    item={item} 
                                    handlePress={(itemVal) => setAmountToSend(`${itemVal}`)} 
                                    currency={
                                        getCurrencySymbol(itemToBeDebited?.currency)
                                    }
                                />
                        }
                        keyExtractor={item => item.id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={configureFundStyles.quickAmounts}
                    />
                </View>

                <View style={configureFundStyles.selectDebitAccount}>
                    <Text style={configureFundStyles.itemContentTitle}>
                        Select your account
                    </Text>
                    <NavigationTabFilterItem 
                        firstFilterItem={'Wallet'}
                        firstFilterItemActive={showWallets}
                        handleFirstFilterItemClick={
                            () => {
                                setShowWallets(true)
                                wallets.length > 0 && Array.isArray(wallets) && setItemToBeDebited(wallets[0])
                            }
                        }
                        secondFilterItem={'Card'}
                        secondFilterItemActive={!showWallets}
                        handleSecondFilterItemClick={
                            () => {
                                setShowWallets(false)
                                cards.length > 0 && Array.isArray(cards) && setItemToBeDebited(cards[0])
                            }
                        }
                        style={configureFundStyles.selectAccountFilter}
                    />
                    {
                        showWallets ?
                            wallets.length > 0 && Array.isArray(wallets) ?
                            <>
                                <SingleWalletItem 
                                    wallet={itemToBeDebited}
                                    currentActiveWallet={itemToBeDebited}
                                    handleWalletItemClick={
                                        () => setSheetModalIsOpen(true)
                                    }
                                />    
                            </>
                            :
                            <></>
                        :
                        <>
                            {
                                cards.length > 0 && Array.isArray(cards) ?
                                <>
                                    <CardItem
                                        card={itemToBeDebited}
                                        isSelectedCard={true}
                                        handleCardClick={
                                            () => setSheetModalIsOpen(true)
                                        }
                                    /> 
                                </> :
                                <></>
                            }
                        </>
                    }
                </View>

                
                <View style={configureFundStyles.addRemarks}>
                    <Text style={configureFundStyles.itemContentTitle}>
                        Remarks
                    </Text>
                    <TextInputComponent 
                        value={remarks}
                        style={configureFundStyles.remarksText}
                        handleInputChange={(name, val) => setRemarks(val)}
                        returnKeyType={'done'}
                        placeholder={'Enter remarks'}
                    />
                </View>

            </ScrollView>

            <View style={configureFundStyles.actionsWrap}>
                <TouchableOpacity 
                    style={configureFundStyles.cancelActionBtn} 
                    onPress={() => navigation.pop()}
                >
                    <Text style={configureFundStyles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={configureFundStyles.sendActionBtn}
                    onPress={handleSendFund}
                >
                    <Text style={configureFundStyles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>


            {/* SELECT ACCOUNT SHEET MODAL */}
            {
                sheetModalIsOpen && 
                <ModalOverlay
                    handleClickOutside={handleCloseBottomSheet}
                >
                    <BottomSheet
                        ref={sheetPanelRef}
                        snapPoints={
                            miniSnapPoints
                        }
                        style={appLayoutStyles.modalWrapper}
                        enablePanDownToClose={true}
                        onClose={handleCloseBottomSheet}
                    >
                        <BottomSheetView style={appLayoutStyles.modalContainer}>
                            <View style={configureFundStyles.modalContentWrapper}>
                                <Text style={appLayoutStyles.modalTitleText}>Change Account</Text>

                                {
                                    showWallets && Array.isArray(wallets) ? <>
                                        {
                                            React.Children.toArray(wallets.map((wallet, index) => {
                                                return <SingleWalletItem 
                                                    wallet={wallet}
                                                    walletIndex={index}
                                                    currentActiveWallet={itemToBeDebited}
                                                    handleWalletItemClick={(indexPassed) => {
                                                        setItemToBeDebited(wallets[indexPassed])
                                                        setSheetModalIsOpen(false)
                                                    }}
                                                />
                                            }))
                                        }
                                    </> :
                                    Array.isArray(cards) ? <>
                                        {
                                            React.Children.toArray(cards.map(card => {
                                                return <CardItem
                                                    card={card}
                                                    isSelectedCard={card?._id === itemToBeDebited?._id}
                                                    handleCardClick={
                                                        (cardPassed) => {
                                                            setItemToBeDebited(cardPassed);
                                                            setSheetModalIsOpen(false);
                                                        }
                                                    }
                                                /> 
                                            }))
                                        }
                                    </> :
                                    <></>
                                }
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                </ModalOverlay>
            }
        </KeyboardAvoidingView>
    </>
}

export default FundsConfigurationScreen;