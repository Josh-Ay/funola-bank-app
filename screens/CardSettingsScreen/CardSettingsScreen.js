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
import { SafeAreaView } from "react-native";
import DepositItem from "../../components/DepositItem/DepositItem";

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

    const [ refreshing, setRefreshing ] = useState(false);
    const toast = useToast();
    const [ currentSlide, setCurrentSlide ] = useState(0);
    const [ currentCardToDisplay, setCurrentCardToDisplay ] = useState(null);
    const cardListingRef = useRef();

    const cardService = new CardServices();
    
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
            console.log('Err fetching card transactions: ', err);
        })

    }, [currentCardToDisplay])

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
            console.log(errorMsg);

            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your card details. Please refresh' : errorMsg, 'danger');
            setRefreshing(false);
        }
    }

    const handleActionItemPress = (action) => {
        console.log(action);
    } 

    return <>
        <AppLayout
            navigation={navigation}
            pageRefreshing={refreshing}
            handlePageRefresh={handleRefresh}
        >
            <View style={cardSettingStyles.topContentWrapper}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={cardSettingStyles.topContent}>
                    <Text style={cardSettingStyles.titleText}>Card Settings</Text>
                    <Text style={cardSettingStyles.subtitleText}>You can change quick links in settings</Text>
                    <SafeAreaView style={cardSettingStyles.cardActionsStyle}>
                        <FlatList
                            data={cardItemActionsList}
                            renderItem={
                                ({item}) => 
                                <UserActionItem 
                                    item={item} 
                                    handleItemPress={handleActionItemPress} 
                                    style={{ marginRight: 30 }} 
                                />
                            }
                            keyExtractor={item => item.id}
                            horizontal={true}
                            contentContainerStyle={{
                                paddingLeft: 8,
                                paddingRight: 8,
                            }}
                        />
                    </SafeAreaView>
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
                        <TouchableOpacity>
                            <Text style={cardSettingStyles.cardsTitleWrapBtn}>All</Text>
                        </TouchableOpacity>
                    }
                </View>

                {
                    !cardTransactions[currentCardToDisplay?._id] ? <Text style={cardSettingStyles.infoText}>Loading transactions...</Text>
                    :
                    cardTransactions[currentCardToDisplay?._id]?.transactions?.length < 1 ? <Text style={cardSettingStyles.infoText}>You have not made any transactions yet</Text>
                    :
                    <View style={cardSettingStyles.transactionItemWrapper}>
                        <View style={cardSettingStyles.transactionItemWrap}>
                            {
                                React.Children.toArray(cardTransactions[currentCardToDisplay?._id]?.transactions?.slice(0, 5)?.map(transaction => {
                                    return <>
                                        <DepositItem 
                                            transaction={transaction}
                                            isTransaction={true}
                                        />
                                    </>
                                }))
                            }
                        </View>
                    </View>
                }

            </View>
        </AppLayout>
    </>
}

export default CardSettingsScreen;