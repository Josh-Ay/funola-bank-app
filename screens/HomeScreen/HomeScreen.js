import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import AppLayout from "../../layouts/AppLayout/AppLayout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import { UserServices } from "../../services/userServices";
import { useToast } from "react-native-toast-notifications";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from "../../utils/colors";
import { homePageStyles } from "./styles";
import { useWalletContext } from "../../contexts/WalletContext";
import { useDepositContext } from "../../contexts/DepositContext";
import { useCardContext } from "../../contexts/CardContext";
import { WalletServices } from "../../services/walletServices";
import { CardServices } from "../../services/cardServices";
import { DepositServices } from "../../services/depositServices";
import { Ionicons } from '@expo/vector-icons';
import UserActionItem from "../../components/UserActionItem/UserActionItem";
import { MaterialIcons } from '@expo/vector-icons';
import { userItemActions, walletItemActionsList } from "./utils";
import CardItem from "../../components/CardItem/Carditem";
import DepositItem from "../../components/DepositItem/DepositItem";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { appLayoutStyles } from "../../layouts/AppLayout/styles";
import { fullSnapPoints, miniSnapPoints } from "../../layouts/AppLayout/utils";
import ModalOverlay from "../../layouts/AppLayout/components/ModalOverlay/ModalOverlay";


const HomeScreen = ({ navigation }) => {

    const { 
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
    } = useUserContext();
    const {
        wallets,
        setWallets,
        walletsLoaded,
        setWalletsLoaded,
        walletsLoading,
        setWalletsLoading,
        showAddWalletModal,
        setShowAddWalletModal,
        showAllWalletsModal,
        setShowAllWalletsModal,
    } = useWalletContext();
    const {
        deposits,
        setDeposits,
        depositsLoaded,
        setDepositsLoaded,
        depositsLoading, 
        setDepositsLoading,
        showAddDepositModal,
        setShowAddDepositModal,
    } = useDepositContext();
    const {
        cards,
        setCards,
        cardsLoaded,
        setCardsLoaded,
        cardsLoading,
        setCardsLoading,
        showAddCardModal,
        setShowAddCardModal,
    } = useCardContext();
    const toast = useToast();
    const [ refreshing, setRefreshing ] = useState(false);
    const [ currentWallet, setCurrentWallet ] = useState(null);
    const [ appLayoutModalIsOpen, setAppLayoutModalIsOpen ] = useState(false);
    const [ walletBalanceObscured, setWalletBalanceObscured ] = useState(false);
    const sheetPanelRef = useRef(null);
    const [ sheetModalIsOpen, setSheetModalIsOpen ] = useState(false);
    const [ currentUserAction, setCurrentUserAction ] = useState(null);

    const [
        userService, 
        walletService, 
        cardService, 
        depositService,
    ] = [
        new UserServices(),
        new WalletServices(),
        new CardServices(),
        new DepositServices(),
    ];

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'normal',
            placement: 'top'
        })
    }

    const handleSnapPress = useCallback(() => {
        sheetPanelRef.current?.snapToIndex(0);
    }, [])

    const handleCloseBottomSheet = () => {
        setSheetModalIsOpen(false);
        setCurrentUserAction(null);
    }


    useEffect(() => {
        setRefreshing(false);
        
        if (wallets.length > 0) {
            setCurrentWallet(wallets[0]);
        }

        if (currentUser || userProfileLoaded) return

        setUserProfileLoading(true);

        userService.getUserProfile().then(res => {
            setCurrentUser(res.data);
            setUserProfileLoaded(true);
            setUserProfileLoading(false);
            setAllOtherUserDataLoading(true);

            Promise.all([
                userService.getNotifications(),
                userService.getOtherUsers(),
                walletService.getWalletsBalance(),
                cardService.getCardsDetail(),
                depositService.getDepositsDetail(),
            ]).then(res => {

                setNotifications(res[0]?.data);
                setOtherUsers(res[1]?.data);
                setWallets(res[2]?.data);
                setCards(res[3]?.data);
                setDeposits(res[4]?.data);

                res[2] && Array.isArray(res[2].data) && res[2].data.length > 0 && setCurrentWallet(res[2].data[0]);

                setAllOtherUserDataLoaded(true);
                setAllOtherUserDataLoading(false);

                setCardsLoading(false);
                setCardsLoaded(true);

                setWalletsLoading(false);
                setWalletsLoaded(true);

                setDepositsLoading(false);
                setDepositsLoaded(true);

            }).catch(err => {

                // console.log(err);
                const errorMsg = err.response ? err.response.data : err.message;
                showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your details. Please refresh' : errorMsg, 'danger')

                setAllOtherUserDataLoading(false);
                setCardsLoading(false);
                setWalletsLoading(false);
                setDepositsLoading(false);
            })

        }).catch(err => {
            // console.warn(err.response ? err.response.data : err.message);

            const errorMsg = err.response ? err.response.data : err.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your details. Please refresh' : errorMsg, 'danger')

            setUserProfileLoading(false);
            setAllOtherUserDataLoading(false);
        })

    }, [])

    useEffect(() => {
        if (!userProfileLoaded || allOtherUserDataLoading) return

        if (!walletsLoaded) {
            walletService.getWalletsBalance()
            .then((res) => {
                setWallets(res?.data);

                Array.isArray(res.data) && res.data.length > 0 && setCurrentWallet(res.data[0]);

                setWalletsLoading(false);
                setWalletsLoaded(true);
            })
            .catch((err) => {
                setWalletsLoading(false);
                const errorMsg = err.response ? err.response.data : err.message;
                showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your wallet details. Please refresh' : errorMsg, 'danger');
            })
        }

        if (!cardsLoaded) {
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

        if (!depositsLoaded) {
            depositService.getDepositsDetail()
            .then((res) => {
                setDeposits(res?.data);

                setDepositsLoading(false);
                setDepositsLoaded(true);
            })
            .catch((err) => {
                const errorMsg = err.response ? err.response.data : err.message;
                showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your deposit details. Please refresh' : errorMsg, 'danger');
                setDepositsLoading(true);
            })
        }
        
    }, [walletsLoaded, cardsLoaded, depositsLoaded])

    useEffect(() => {
        if (
            showAddWalletModal ||
            showAddCardModal ||
            showAddDepositModal ||
            showAllWalletsModal
        ) return setAppLayoutModalIsOpen(true);

        setAppLayoutModalIsOpen(false);

    }, [showAddWalletModal, showAddDepositModal, showAddCardModal, showAllWalletsModal])

    const handleSwitchWallets = (indexPassed) => {
        if (!wallets[indexPassed]) return
        setCurrentWallet(wallets[indexPassed]);
    }

    const handleSwitchWalletsBtnClick = () => {
        setShowAllWalletsModal(!showAllWalletsModal);
        setShowAddWalletModal(false);
        setShowAddDepositModal(false);
        setShowAddCardModal(false);
    }

    const handleRefresh = async () => {
        const [
            userService, 
            walletService, 
            cardService, 
            depositService,
        ] = [
            new UserServices(),
            new WalletServices(),
            new CardServices(),
            new DepositServices(),
        ];

        setRefreshing(true);
        setShowAddWalletModal(false);
        setShowAddDepositModal(false);
        setShowAddCardModal(false);
        setShowAllWalletsModal(false);

        await Promise.all([
            userService.getUserProfile(),
            userService.getNotifications(),
            userService.getOtherUsers(),
            walletService.getWalletsBalance(),
            cardService.getCardsDetail(),
            depositService.getDepositsDetail(),
        ]).then(res => {
            setCurrentUser(res[0]?.data);
            setNotifications(res[1]?.data);
            setOtherUsers(res[2]?.data);
            setWallets(res[3]?.data);
            setCards(res[4]?.data);
            setDeposits(res[5]?.data);

            res[3] && Array.isArray(res[3].data) && res[3].data.length > 0 && setCurrentWallet(res[3].data[0]);

            setRefreshing(false);
            setAllOtherUserDataLoaded(true);
            setAllOtherUserDataLoading(false);

            setCardsLoading(false);
            setCardsLoaded(true);

            setWalletsLoading(false);
            setWalletsLoaded(true);

            setDepositsLoading(false);
            setDepositsLoaded(true);
        }).catch(err => {
            const errorMsg = err.response ? err.response.data : err.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your details. Please refresh' : errorMsg, 'danger');
            setRefreshing(false);
        })
    }

    const handleActionItemPress = (itemAction) => {
        if (sheetModalIsOpen) return

        switch (itemAction) {
            case userItemActions.walletFund:
                setCurrentUserAction(itemAction);
                setSheetModalIsOpen(true);
                break;
        
            default:
                console.log(itemAction);
                break;
        }
    }

    return <>
        <AppLayout
            navigation={navigation}
            pageRefreshing={refreshing}
            handlePageRefresh={handleRefresh}
            handleSelectWallet={handleSwitchWallets}
            currentActiveWallet={currentWallet}
            sheetModalIsOpen={sheetModalIsOpen}
        >
            <View style={homePageStyles.topContentWrapper}>
                <View style={homePageStyles.topContent}>
                    <View style={homePageStyles.leftTopContent}>
                        <View>
                            {
                                walletsLoading ? <Text style={Object.assign({}, homePageStyles.contentItemLoading, homePageStyles.whiteText)}>
                                    Fetching wallet info
                                </Text> 
                                :
                                !walletsLoaded ? <Text style={Object.assign({}, homePageStyles.contentItemLoading, homePageStyles.whiteText)}>
                                    Wallets failed to load. Please refresh
                                </Text> :
                                !currentWallet ? <>
                                    <Image 
                                        source={require('../../assets/noWalletIllustration.png')} 
                                        style={homePageStyles.noWalletContentImage}
                                    />
                                    <Text style={homePageStyles.noWalletText}>
                                        You do not have any wallets yet
                                    </Text>
                                    <View style={homePageStyles.createNewWallet}>
                                        <UserActionItem 
                                            item={{
                                                title: 'Create',
                                                icon: <MaterialIcons name="add-box" size={24} color={colors.grey} />,
                                            }}
                                            handleItemPress={() => setShowAddWalletModal(true)}
                                        />
                                    </View>
                                </> 
                                :
                                <>
                                    <TouchableOpacity 
                                        style={homePageStyles.switchWalletsBtn} 
                                        onPress={handleSwitchWalletsBtnClick}>
                                        {
                                            currentWallet?.currency === 'NGN' ?   
                                                <Image 
                                                    source={require('../../assets/currenciesFlag/NGN.jpg')}
                                                    style={homePageStyles.walletImage}
                                                />   
                                            :
                                            currentWallet?.currency === 'USD' ?      
                                                <Image 
                                                    source={require('../../assets/currenciesFlag/USD.jpg')}
                                                    style={homePageStyles.walletImage}
                                                />
                                            : 
                                            <></>
                                        }
                                        <Text>{currentWallet?.currency}</Text>
                                        <Ionicons name="swap-vertical" size={24} color={colors.deepBlue} />
                                    </TouchableOpacity>
                                    <Text style={homePageStyles.balanceText}>
                                        {
                                            `${
                                                currentWallet?.currency === 'NGN' ? 
                                                    '₦' 
                                                : 
                                                currentWallet?.currency === 'USD' ? 
                                                    '$' 
                                                : 
                                                    ''
                                                } ${
                                                    walletBalanceObscured ? 
                                                        '****'
                                                    :
                                                    Number(Number(currentWallet?.balance)?.toFixed(2))?.toLocaleString()
                                                }`
                                        }
                                    </Text>
                                    <Text style={homePageStyles.balanceTextIndicator}>
                                        Available Balance
                                    </Text>
                                    {
                                        currentWallet?.unclearedBalance ? 
                                            <Text style={homePageStyles.pendingBalanceTextIndicator}>
                                                Pending Balance: {walletBalanceObscured ? '****' : Number(Number(currentWallet?.unclearedBalance)?.toFixed(2))?.toLocaleString()}
                                            </Text>
                                        :
                                        <></>
                                    }
                                </>
                            }
                            
                        </View>
                        {
                            currentWallet &&
                            <TouchableOpacity
                                onPress={() => setWalletBalanceObscured(!walletBalanceObscured)}
                            >
                                {
                                    walletBalanceObscured ? 
                                        <Ionicons name="eye-outline" size={24} color={colors.paleBlue} />
                                    :
                                    <Ionicons name="eye-off-outline" size={24} color={colors.paleBlue} />
                                }
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={homePageStyles.rightTopContent}>
                        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                            <MaterialCommunityIcons 
                                name={
                                    notifications.length > 0 ? 
                                        "bell-badge" : 
                                        "bell"
                                } 
                                size={24} 
                                color={colors.paleBlue}
                                style={homePageStyles.notificationIcon}
                                
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={homePageStyles.userImage} onPress={() => navigation.navigate('Profile')}>
                            {
                                currentUser?.gender === 'M' ?
                                <Image style={homePageStyles.image} source={require('../../assets/man.jpg')} />
                                :
                                <Image style={homePageStyles.image} source={require('../../assets/woman.jpg')} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    currentWallet ? 
                    <SafeAreaView style={homePageStyles.walletActionsStyle}>
                        <FlatList
                            data={walletItemActionsList}
                            renderItem={
                                ({item}) => <UserActionItem item={item} handleItemPress={handleActionItemPress} />
                            }
                            keyExtractor={item => item.id}
                            horizontal={true}
                            style={homePageStyles.actionItemsWrapper}
                        />
                    </SafeAreaView>
                    :
                    <></>
                }
            </View>
            
            <View 
                style={ 
                    (appLayoutModalIsOpen || sheetModalIsOpen) ? 
                    Object.assign({}, homePageStyles.mainContent, homePageStyles.overlayContent)
                    :
                    homePageStyles.mainContent
                }
            >
                <View style={homePageStyles.headerItem}>
                    <Text style={homePageStyles.titleText}>Your cards</Text>
                    <TouchableOpacity onPress={() => setShowAddCardModal(true)}>
                        <Text style={homePageStyles.addNewText}>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={homePageStyles.spacingItem}></View>
                <View 
                    style={
                        (appLayoutModalIsOpen || sheetModalIsOpen) ? 
                            Object.assign({}, homePageStyles.userItemsWrapper, homePageStyles.overlayContent)
                        :
                        homePageStyles.userItemsWrapper
                    }
                >
                    {
                        cardsLoading ? <Text style={homePageStyles.contentItemLoading}>
                            Fetching cards
                        </Text> 
                        :
                        !cardsLoaded ? <Text style={Object.assign({}, homePageStyles.contentItemLoading, homePageStyles.whiteText)}>
                            Cards failed to load. Please refresh
                        </Text> 
                        :
                        cards.length < 1 ? <View style={homePageStyles.noContentWrapper}>
                            <Image 
                                source={require('../../assets/no-content.png')} 
                                style={homePageStyles.noContentImage}
                            />
                            <Text style={homePageStyles.contentItemLoading}>You do not have any cards</Text> 
                        </View>    
                        :
                        React.Children.toArray(cards.map(card => {
                            return <CardItem 
                                card={card} 
                                modalIsOpen={appLayoutModalIsOpen || sheetModalIsOpen} 
                            />
                        }))
                    }
                </View>
                <View style={homePageStyles.spacingItem}></View>
                <View style={homePageStyles.headerItem}>
                    <Text style={homePageStyles.titleText}>Deposits</Text>
                    <TouchableOpacity onPress={() => setShowAddDepositModal(true)}>
                        <Text style={homePageStyles.addNewText}>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={homePageStyles.spacingItem}></View>
                <View 
                    style={
                        (appLayoutModalIsOpen || sheetModalIsOpen) ? 
                            Object.assign({}, homePageStyles.userItemsWrapper, homePageStyles.overlayContent)
                        :
                        homePageStyles.userItemsWrapper
                    }
                >
                    {
                        depositsLoading ? <Text style={homePageStyles.contentItemLoading}>
                            Fetching deposits
                        </Text> 
                        :
                        !depositsLoaded ? <Text style={Object.assign({}, homePageStyles.contentItemLoading, homePageStyles.whiteText)}>
                            Deposits failed to load. Please refresh
                        </Text> 
                        :
                        deposits.length < 1 ? <View style={homePageStyles.noContentWrapper}>
                            <Image 
                                source={require('../../assets/no-content.png')} 
                                style={homePageStyles.noContentImage}
                            />
                            <Text style={homePageStyles.contentItemLoading}>You do not have any deposits</Text> 
                        </View>
                        :
                        React.Children.toArray(deposits.slice(0, 3).map(deposit => {
                            return <DepositItem 
                                deposit={deposit}
                                modalIsOpen={appLayoutModalIsOpen || sheetModalIsOpen}
                            />
                        }))
                    }
                </View>
                
                {
                    Array.isArray(deposits) && deposits.length > 3 && 
                    <TouchableOpacity 
                        style={homePageStyles.seeAllBtn}
                    >
                        <Text style={homePageStyles.seeAllBtnText}>See all deposits</Text>
                    </TouchableOpacity>
                }
            </View>
            
            {
                sheetModalIsOpen && 
                <ModalOverlay>
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
                            <Text style={appLayoutStyles.modalTitleText}>
                                {console.log('this->', currentUserAction)}
                                {console.log('against->', userItemActions.walletFund)}
                                {
                                    currentUserAction == userItemActions.walletFund ?
                                        'Fund wallet'
                                    :
                                    'd'
                                }
                            </Text>

                        </BottomSheetView>
                    </BottomSheet>
                </ModalOverlay>
            }
        </AppLayout>
    </>
}

export default HomeScreen;