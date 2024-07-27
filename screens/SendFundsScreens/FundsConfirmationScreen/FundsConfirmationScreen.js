import { Image, ScrollView, Text, View } from "react-native";
import { colors } from "../../../utils/colors";
import { fundsConfirmationStyles } from "./fundsConfirmationStyles";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from "react";
import { StackActions } from "@react-navigation/native";
import { changeToTitleCase, getCurrencySymbol } from "../../../utils/helpers";
import ContactItem from "../SendFundsScreen/components/ContactItem/ContactItem";
import { useWalletContext } from "../../../contexts/WalletContext";
import { WalletServices } from "../../../services/walletServices";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import ModalOverlay from "../../../layouts/AppLayout/components/ModalOverlay/ModalOverlay";
import { appLayoutStyles } from "../../../layouts/AppLayout/styles";
import PinInputForm from "../../../components/PinInputForm/PinInputForm";
import { useToast } from "react-native-toast-notifications";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import BankItem from "../SendFundsScreen/components/BankItem/BankItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardServices } from "../../../services/cardServices";
import { useCardContext } from "../../../contexts/CardContext";
import { useUserContext } from "../../../contexts/UserContext";

const FundsConfirmationScreen = ({ navigation, route }) => {

    const [ fundTransferDetail, setFundTransferDetail ] = useState(null);
    const [ fundTransferSuccessful, setFundTransferSuccessful ] = useState(false);
    const [ isRecentItem, setIsRecentItem ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ pin, setPin ] = useState('');
    const [ sheetModalIsOpen, setSheetModalIsOpen ] = useState(false);

    const sheetPanelRef = useRef();
    const {
        wallets,
        setWallets,
        walletTransactions, 
        setWalletTransactions,
    } = useWalletContext();

    const {
        cards,
        setCards,
        cardTransactions, 
        setCardTransactions,
    } = useCardContext();

    const {
        currentUser
    } = useUserContext();

    const [
        walletService,
        cardService
    ] = [
        new WalletServices(),
        new CardServices(),
    ];
    const requiredTransactionPinLength = 6;

    const toast = useToast();

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'info',
            placement: 'top'
        })
    }

    useEffect(() => {
        const {
            amount,
            transferType,
            receiver,
            itemToBeDebited,
            isRecent,
            remarks,
        } = route?.params;

        if (
            !amount ||
            !transferType ||
            !receiver ||
            !itemToBeDebited
        ) {
            navigation.dispatch(
                StackActions.replace('SendFunds')
            )
            return
        }

        setFundTransferDetail({
            amount,
            transferType,
            receiver,
            itemToBeDebited,
            remarks: remarks.length < 1 ? 
                `${changeToTitleCase(transferType)} transfer` 
                : 
            remarks,
        })

        if (isRecent) setIsRecentItem(true)

    }, [])

    useEffect(() => {
        if (loading || fundTransferSuccessful) return

        if (pin.length === requiredTransactionPinLength) {
            handleSendFund()
        }
    }, [pin])

    const handleContinueBtnClick = () => {
        if (fundTransferSuccessful) {
            navigation.dispatch(
                StackActions.replace('Home')
            )
            return
        }

        const cardIsToBeDebited = (
            fundTransferDetail?.itemToBeDebited?.paymentNetwork && 
            fundTransferDetail?.itemToBeDebited?.cardName
        ) ? 
            true 
        : 
        false;

        if (
            cardIsToBeDebited &&
            (
                !fundTransferDetail?.itemToBeDebited?.onlinePaymentEnabled ||
                fundTransferDetail?.itemToBeDebited?.onlinePaymentEnabled !== true
            )
        ) {
            showToastMessage("Please enable online payments on your card first");
            return
        }

        setSheetModalIsOpen(true);
    }

    const handleSendFund = async () => {
        const [
            copyOfWallets,
            copyOfCurrentWalletTransactions,
            copyOfCards,
            copyOfCurrentCardTransactions,
        ] = [
            wallets?.slice(),
            {...walletTransactions},
            cards?.slice(),
            {...cardTransactions},
        ];
        
        const initialDataToPost = {
            pin: pin,
            remarks: fundTransferDetail?.remarks,
            amount: fundTransferDetail?.amount,
            currency: fundTransferDetail?.itemToBeDebited?.currency,
        }

        switch (fundTransferDetail?.transferType) {
            case 'wallet':     
            case 'bank':
                const cardIsToBeDebited = (
                    fundTransferDetail?.itemToBeDebited?.paymentNetwork && 
                    fundTransferDetail?.itemToBeDebited?.cardName
                ) ? 
                    true 
                : 
                false;

                try {
                    setLoading(true);

                    const res = cardIsToBeDebited ? 
                        (await cardService.transferFromCard(
                            fundTransferDetail?.itemToBeDebited?._id,
                            fundTransferDetail?.transferType === 'wallet' ?
                                {
                                    ...initialDataToPost,
                                    receiverId: isRecentItem ? fundTransferDetail?.receiver?.userId : fundTransferDetail?.receiver?._id,
                                    receiveInWallet: route?.params?.receivingItemType === 'card' ? false : true,
                                }
                            :
                            {
                                ...initialDataToPost,
                                bankId: fundTransferDetail?.receiver?._id
                            },
                            fundTransferDetail?.transferType,
                        )).data 
                    : 
                    (await walletService.transferFromWallet(
                        fundTransferDetail?.transferType === 'wallet' ?
                        {
                            ...initialDataToPost,
                            receiverId: isRecentItem ? fundTransferDetail?.receiver?.userId : fundTransferDetail?.receiver?._id,
                            receiveInWallet: route?.params?.receivingItemType === 'card' ? false : true,
                        }
                        :
                        {
                            ...initialDataToPost,
                            bankId: fundTransferDetail?.receiver?._id
                        },
                        fundTransferDetail?.transferType,
                    )).data;

                    const newTransactionObj = {
                        owner: currentUser?._id,
                        transactionType: 'transfer',
                        transactionRemarks: initialDataToPost.remarks,
                        recipientInfo: '',
                        amount: initialDataToPost.amount,
                        status: 'success',
                        currency: initialDataToPost.currency,
                        createdAt: new Date(),
                    }

                    if (fundTransferDetail?.transferType === 'wallet') newTransactionObj.recipientInfo = isRecentItem ? fundTransferDetail?.receiver?.userId : fundTransferDetail?.receiver?._id;
                    if (cardIsToBeDebited) newTransactionObj.cardId = fundTransferDetail?.itemToBeDebited?._id;
                    if (!cardIsToBeDebited) newTransactionObj.walletId = fundTransferDetail?.itemToBeDebited?._id;

                    const foundItemToUpdateBalance = cardIsToBeDebited ?
                        copyOfCards?.find(item => item._id === fundTransferDetail?.itemToBeDebited?._id)
                    :
                    copyOfWallets?.find(item => item._id === fundTransferDetail?.itemToBeDebited?._id);
                    
                    if (foundItemToUpdateBalance) {
                        foundItemToUpdateBalance.balance -= fundTransferDetail?.amount;
                        
                        if (cardIsToBeDebited) {
                            setCards(copyOfCards);

                            if (copyOfCurrentCardTransactions[fundTransferDetail?.itemToBeDebited?._id] && Array.isArray(copyOfCurrentCardTransactions[fundTransferDetail?.itemToBeDebited?._id]?.transactions)) {
                                copyOfCurrentCardTransactions[fundTransferDetail?.itemToBeDebited?._id]?.transactions?.unshift(newTransactionObj);
                                setCardTransactions(copyOfCurrentCardTransactions);
                            }
                        }
                        if (!cardIsToBeDebited) {
                            setWallets(copyOfWallets);

                            if (copyOfCurrentWalletTransactions[fundTransferDetail?.itemToBeDebited?._id] && Array.isArray(copyOfCurrentWalletTransactions[fundTransferDetail?.itemToBeDebited?._id]?.transactions)) {
                                copyOfCurrentWalletTransactions[fundTransferDetail?.itemToBeDebited?._id]?.transactions?.unshift(newTransactionObj);
                                setWalletTransactions(copyOfCurrentWalletTransactions);
                            }
                        }
                    }

                    showToastMessage(res, 'success');
                    setLoading(false);
                    setFundTransferSuccessful(true);
                    setSheetModalIsOpen(false);

                } catch (error) {
                    setLoading(false);
                    setPin('');
                    
                    const errorMsg = error.response ? error.response.data : error.message;
                    showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to transfer funds. Please try again later' : errorMsg, 'danger');
                }

                break;
            default:
                console.log('invalid type passed');
                break;
        }
    }

    return <>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paleBlue }}>
            <View style={fundsConfirmationStyles.topContentWrapper}>
                {
                    fundTransferSuccessful ? <></>
                    :
                    <TouchableOpacity onPress={() => navigation.pop()}>
                        <Ionicons name="chevron-back" size={24} color={colors.white} />
                    </TouchableOpacity>
                }
                <View style={fundsConfirmationStyles.topContent}>
                    <Text style={fundsConfirmationStyles.titleText}>
                        {
                            fundTransferSuccessful ? 
                                'Congrats!' 
                                : 
                            'Confirm details'
                        }
                    </Text>
                    <Text style={fundsConfirmationStyles.subtitleText}>
                        {
                            fundTransferSuccessful ? 
                                'You successfully sent money' 
                            : 
                            'Confirm funds to be sent'
                        }
                    </Text>
                </View>
            </View>
            <ScrollView style={fundsConfirmationStyles.contentWrapper}>
                <Text style={fundsConfirmationStyles.itemContentTitle}>
                    Transfer detail
                </Text>
                {
                    !fundTransferSuccessful ? <>
                        <View style={fundsConfirmationStyles.confirmFundDetailWrap}>
                            <View style={fundsConfirmationStyles.confirmFundDetailItem}>
                                <Text style={fundsConfirmationStyles.contentTitleText}>Amount</Text>
                                <Text style={fundsConfirmationStyles.contentText}>{getCurrencySymbol(fundTransferDetail?.itemToBeDebited?.currency)} {Number(fundTransferDetail?.amount).toLocaleString()}</Text>
                            </View>
                            <View style={fundsConfirmationStyles.confirmFundDetailItem}>
                                <Text style={fundsConfirmationStyles.contentTitleText}>{changeToTitleCase((fundTransferDetail?.itemToBeDebited?.cardName && fundTransferDetail?.itemToBeDebited?.paymentNetwork) ? 'card' : fundTransferDetail?.transferType)} to be debited</Text>
                                <Text style={fundsConfirmationStyles.contentText}>Your {fundTransferDetail?.itemToBeDebited?.currency} {(fundTransferDetail?.itemToBeDebited?.cardName && fundTransferDetail?.itemToBeDebited?.paymentNetwork) ? 'card' : fundTransferDetail?.transferType}</Text>
                            </View>
                            <View style={fundsConfirmationStyles.confirmFundDetailItem}>
                                <Text style={fundsConfirmationStyles.contentTitleText}>Remarks</Text>
                                <Text style={fundsConfirmationStyles.contentText}>{fundTransferDetail?.remarks?.length < 1 ? 'Transfer' : fundTransferDetail?.remarks}</Text>
                            </View>
                        </View>
                    </> :
                    <>
                        <Image 
                            source={require('../../../assets/check-illustration.png')} 
                            style={fundsConfirmationStyles.imageContent} 
                        />
                        <Text style={fundsConfirmationStyles.successAmountText}>
                            {getCurrencySymbol(fundTransferDetail?.itemToBeDebited?.currency)} {Number(fundTransferDetail?.amount).toLocaleString()}
                        </Text>
                        <Text style={fundsConfirmationStyles.successInfoText}>
                            {
                                fundTransferDetail?.transferType === 'wallet' ?
                                    '*The user will receive funds within 2 minutes'
                                :
                                fundTransferDetail?.transferType === 'bank' ?
                                    '*note that the transfer can take between 1 - 3 days'
                                :
                                '*Fund transfer successful'
                            }
                        </Text>
                    </>
                }
            </ScrollView>
            
            <View style={fundsConfirmationStyles.actionsWrap}>
                <View style={fundsConfirmationStyles.confirmRecipientDetailItem}>
                    <Text style={fundsConfirmationStyles.contentTitleText}>
                        {
                            fundTransferDetail?.transferType === 'wallet' ?
                                'Recipient'
                            :
                            fundTransferDetail?.transferType === 'bank' ?
                                'Bank Detail'
                            :
                            ''
                        }
                    </Text>
                    {
                        (fundTransferDetail?.transferType === 'wallet') ?
                            <ContactItem 
                                item={
                                    {
                                        name: isRecentItem ?
                                            fundTransferDetail?.receiver?.nameOfUser
                                            :
                                        `${fundTransferDetail?.receiver?.firstName} ${fundTransferDetail?.receiver?.lastName}`
                                        ,
                                        phoneNumbers: isRecentItem ?
                                            [
                                                {
                                                    digits: `${fundTransferDetail?.receiver?.userPhoneNumberExtension}${fundTransferDetail?.receiver?.userPhoneNumber}`,
                                                }
                                            ]
                                        :
                                        [
                                            {
                                                digits: `${fundTransferDetail?.receiver?.phoneNumberExtension}${fundTransferDetail?.receiver?.phoneNumber}`,
                                            }
                                        ]
                                        ,
                                        gender: isRecentItem ?
                                            fundTransferDetail?.receiver?.userGender 
                                            :
                                        fundTransferDetail?.receiver?.gender,
                                    }
                                }
                                hideContactActionBtn={true}
                                genderSelectionAvailable={true}
                                style={fundsConfirmationStyles.recipient}
                            />
                        :
                        fundTransferDetail?.transferType === 'bank' ?
                            <BankItem
                                item={fundTransferDetail?.receiver}
                                isNotPressable={true}
                                style={fundsConfirmationStyles.recipient}
                            />
                        :
                        <></>
                    }
                </View>

                <TouchableOpacity 
                    style={fundsConfirmationStyles.sendActionBtn}
                    onPress={handleContinueBtnClick}
                >
                    <Text style={fundsConfirmationStyles.sendText}>
                        {
                            fundTransferSuccessful ? 
                                'Go Home' 
                                :
                                'Continue'
                        }
                    </Text>
                </TouchableOpacity>
            </View>

            {/* TRANSACTION PIN MODAL */}
            {
                sheetModalIsOpen && 
                <ModalOverlay
                    handleClickOutside={() => setSheetModalIsOpen(false)}
                >
                    <BottomSheet
                        ref={sheetPanelRef}
                        snapPoints={
                            ['66%']
                        }
                        style={appLayoutStyles.modalWrapper}
                        enablePanDownToClose={true}
                        onClose={() => setSheetModalIsOpen(false)}
                    >
                        <BottomSheetView style={appLayoutStyles.modalContainer}>
                            <View style={fundsConfirmationStyles.modalContentWrapper}>
                                <Text style={appLayoutStyles.modalTitleText}>Enter transaction pin</Text>
                                <PinInputForm 
                                    pin={pin}
                                    updatePin={setPin}
                                    numberOfInputs={requiredTransactionPinLength}
                                />                           
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                </ModalOverlay>
            }

            {
                loading && <>
                    <LoadingScreen 
                        contentText={'Sending funds...'}
                    />
                </>
            }
        </SafeAreaView>
    </>
}

export default FundsConfirmationScreen;