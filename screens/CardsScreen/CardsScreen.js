import React, { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../../layouts/AppLayout/AppLayout";
import { Text, View } from "react-native";
import { useCardContext } from "../../contexts/CardContext";
import { CardServices } from "../../services/cardServices";
import { useToast } from "react-native-toast-notifications";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import { cardScreenStyles } from "./cardStyles";
import { FlatList } from "react-native";
import FullCardItem from "../../components/FullCardItem/FullCardItem";
import CardItem from "../../components/CardItem/Carditem";

const CardsScreen = ({ navigation }) => {
    const {
        cards,
        setCards,
        cardsLoaded,
        setCardsLoaded,
        cardsLoading,
        setCardsLoading,
    } = useCardContext();

    const [ refreshing, setRefreshing ] = useState(false);
    const toast = useToast();
    const [ activeTab, setActiveTab ] = useState('physical');
    const [ currentSlide, setCurrentSlide ] = useState(0);
    const [ currentCardToDisplay, setCurrentCardToDisplay ] = useState(null);
    const [ cardSettingBeingUpdated, setCardSettingBeingUpdated ] = useState({});

    const cardService = new CardServices();
    
    const viewabilityConfig = {
        viewAreaCoveragePercentThreshold: 50,
        waitForInteraction: true,
    }

    const onViewableItemsChanged = ({ viewableItems, changed }) => {
        console.log("Active item index", changed[0]?.index);
        console.log("Active item", changed[0]?.item);
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

        if (cardsLoaded) return
        
        setCardsLoading(true);

        cardService.getCardsDetail()
        .then((res) => {
            setCards(res?.data);

            setCardsLoading(false);
            setCardsLoaded(true);

            setCardSettingBeingUpdated(
                res?.data?.map(card => card._id).reduce((a, v) => ({ ...a, [v]: []}), {})
            );
        })
        .catch((err) => {
            const errorMsg = err.response ? err.response.data : err.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your card details. Please refresh' : errorMsg, 'danger');
            setCardsLoading(false);
        })

    }, [])

    useEffect(() => {
        if (Array.isArray(cards) && cards.filter(card => card?.cardType === activeTab)?.length > 0 && cards[currentSlide]) return setCurrentCardToDisplay(cards[currentSlide]);

        setCurrentCardToDisplay(null);
    }, [currentSlide, activeTab, cards])

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            const res = (await cardService.getCardsDetail()).data;
            setCards(res);

            setRefreshing(false);
            setCardsLoaded(true);
            setCardsLoading(false);

            setCardSettingBeingUpdated(
                res?.map(card => card._id).reduce((a, v) => ({ ...a, [v]: []}), {})
            )
            console.log('refresh for cards done');

        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            console.log(errorMsg);

            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your card details. Please refresh' : errorMsg, 'danger');
            setRefreshing(false);
        }
    }

    const handleUpdateCardSettingItem = async (currentCard, settingToUpdate, newValue) => {
        const [
            copyOfCards,
            foundCardIndex,
            currentSettingsBeingUpdated,
        ] = [
            cards?.slice(),
            cards?.findIndex(card => card._id === currentCard?._id),
            {...cardSettingBeingUpdated}
        ]

        if (
            foundCardIndex === -1 || 
            currentSettingsBeingUpdated[currentCard?._id]?.includes(settingToUpdate)
        ) return
        
        currentSettingsBeingUpdated[currentCard?._id]?.push(settingToUpdate);
        setCardSettingBeingUpdated(currentSettingsBeingUpdated);

        const updatedCardVal = { ...currentCard, [settingToUpdate]: newValue }
        copyOfCards[foundCardIndex] = updatedCardVal;

        setCurrentCardToDisplay(updatedCardVal);
        setCards(copyOfCards);
        

        try {
            const res = await (await cardService.updateCardSetting(currentCard?._id, settingToUpdate, { newValue: `${newValue}`})).data;
            console.log(res);

            currentSettingsBeingUpdated[currentCard?._id] = currentSettingsBeingUpdated[currentCard?._id]?.filter(setting => setting !== settingToUpdate);
            setCardSettingBeingUpdated(currentSettingsBeingUpdated);

            showToastMessage('Successfully updated card setting', 'success');

        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            console.log(errorMsg);

            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to update your card details. Please refresh' : errorMsg, 'danger');

            const updatedCardVal = { ...currentCard, [settingToUpdate]: !newValue }
            copyOfCards[foundCardIndex] = updatedCardVal;

            setCurrentCardToDisplay(updatedCardVal);
            setCards(copyOfCards);
            
            currentSettingsBeingUpdated[currentCard?._id] = currentSettingsBeingUpdated[currentCard?._id]?.filter(setting => setting !== settingToUpdate);
            setCardSettingBeingUpdated(currentSettingsBeingUpdated);
        }
    }

    return <>
        <AppLayout
            navigation={navigation}
            pageRefreshing={refreshing}
            handlePageRefresh={handleRefresh}
        >
            <View style={cardScreenStyles.topContentWrapper}>
                <View>
                    <Text style={cardScreenStyles.topTitleText}>Your Cards</Text>
                    <Text style={cardScreenStyles.topSubtitleText}>
                        {cards?.filter(card => card.cardType === 'physical')?.length} physical card, {cards?.filter(card => card.cardType === 'virtual')?.length} virtual card
                    </Text>
                </View>
                {
                    cards?.length > 0 &&
                    <TouchableOpacity onPress={() => navigation.navigate('CardSettings')}>
                        <MaterialCommunityIcons name="dots-horizontal" size={34} color="black" />
                    </TouchableOpacity>
                }
            </View>

            <View style={cardScreenStyles.cardTypeSelection}>
                <TouchableOpacity
                    style={cardScreenStyles.cardTypeSelectionItem}
                    onPress={() => setActiveTab('physical')}
                >
                    <Text 
                        style={activeTab === 'physical' ? cardScreenStyles.activeCardType : cardScreenStyles.cardTypeText}
                    >
                        Physical card
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={cardScreenStyles.cardTypeSelectionItem}
                    onPress={() => setActiveTab('virtual')}
                >
                    <Text
                        style={activeTab === 'virtual' ? cardScreenStyles.activeCardType : cardScreenStyles.cardTypeText}
                    >
                        Virtual card
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                {
                    cards.filter(card => card?.cardType === activeTab)?.length < 1 ?
                        <View style={cardScreenStyles.noCardWrapper}>
                            <Text style={cardScreenStyles.noCardsText}>You do not have any {activeTab} cards yet</Text> 
                        </View>
                    :
                    <FlatList 
                        data={cards && Array.isArray(cards) ? cards.filter(card => card?.cardType === activeTab) : []}
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
                        contentContainerStyle={cardScreenStyles.cardsListing}
                        pagingEnabled
                        viewabilityConfig={viewabilityConfig}
                        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                        // onViewableItemsChanged={handleViewableItemsChange}
                        showsHorizontalScrollIndicator={false}
                    />
                }
                
            </View>
            
            {
                cards.filter(card => card?.cardType === activeTab)?.length < 1 ?
                    <></> 
                :
                <View style={cardScreenStyles.cardsIndicatorWrapper}>
                    {
                        React.Children.toArray(
                            cards.filter(card => card?.cardType === activeTab)?.map((item, index) => {
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

            {
                currentCardToDisplay && 
                <View style={cardScreenStyles.cardSettingsWrapper}>
                    <Text style={cardScreenStyles.cardSettingsTitle}>Card Settings</Text>
                    <CardItem 
                        card={currentCardToDisplay}
                        isCardSettingItem={true}
                        cardSettingType={'Contactless Payment'}
                        cardSettingTypeKey={'contactlessPaymentEnabled'}
                        handleCardSettingChange={(val) => handleUpdateCardSettingItem(cards[currentSlide], 'contactlessPaymentEnabled', val)}
                    />
                    <CardItem 
                        card={currentCardToDisplay}
                        isCardSettingItem={true}
                        cardSettingType={'Online Payment'}
                        cardSettingTypeKey={'onlinePaymentEnabled'}
                        handleCardSettingChange={(val) => handleUpdateCardSettingItem(cards[currentSlide], 'onlinePaymentEnabled', val)}
                    />
                    <CardItem 
                        card={currentCardToDisplay}
                        isCardSettingItem={true}
                        cardSettingType={'ATM Withdraws'}
                        cardSettingTypeKey={'atmWithdrawalsEnabled'}
                        handleCardSettingChange={(val) => handleUpdateCardSettingItem(cards[currentSlide], 'atmWithdrawalsEnabled', val)}
                    />
                </View>
            }


        </AppLayout>
    </>
}

export default CardsScreen;