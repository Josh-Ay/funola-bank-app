import { Image, Text, TouchableOpacity, View } from 'react-native';
import { formatDateToMonthAndYear, getCurrencySymbol } from '../../utils/helpers';
import { cardStyles } from './cardStyles';
import Toggle from 'react-native-toggle-input'
import { colors } from '../../utils/colors';

export default function CardItem ({ 
    card, 
    modalIsOpen,
    handleCardClick,
    isCardSettingItem,
    cardSettingType,
    cardSettingTypeKey,
    handleCardSettingChange,
    isSelectedCard,
}) {
    if (!card) return <></>

    if (isCardSettingItem) return <>
        <View
            style={
                Object.assign({}, cardStyles.singleUserItem, cardStyles.cardSettingItem)
            }
        >
            <View style={cardStyles.cardLeftContent}>
                <View style={cardStyles.cardImageWrapper}>
                    <Image 
                        source={
                            cardSettingTypeKey === 'contactlessPaymentEnabled' ?
                                require('../../assets/cardSettingIcons/qr-code-scan.png')
                            :
                            cardSettingTypeKey === 'onlinePaymentEnabled' ?
                                require('../../assets/cardSettingIcons/online-payment.png')
                            :
                            cardSettingTypeKey === 'atmWithdrawalsEnabled' ?
                                require('../../assets/cardSettingIcons/atm.png')
                            :
                            require('../../assets/cardSettingIcons/settings.png')
                        }
                        style={cardStyles.cardImage}
                    />
                </View>
                <View>
                    <Text style={cardStyles.cardSettingContentText}>{cardSettingType}</Text>
                </View>
            </View>
            <View style={cardStyles.cardRightContent}>
                <Toggle 
                    color={colors.green}
                    size={20}
                    filled={true}
                    circleColor={colors.white}
                    toggle={card[cardSettingTypeKey]}
                    setToggle={
                        handleCardSettingChange && typeof handleCardSettingChange === 'function' ?
                            (val) => handleCardSettingChange(val)
                        :
                        (val) => console.log(val)
                    }
                />
            </View>
        </View>
    </>
    
    return <>
        <TouchableOpacity 
            style={
                isSelectedCard ?
                    Object.assign(
                        {},
                        cardStyles.singleUserItem,
                        cardStyles.activeCard
                    )
                :
                cardStyles.singleUserItem
            }
            onPress={
                handleCardClick && typeof handleCardClick === 'function' ?
                    () => handleCardClick(card)
                :
                () => {}   
            }
        >
            <View style={cardStyles.cardLeftContent}>
                <View 
                    style={
                        modalIsOpen ? 
                            Object.assign({}, cardStyles.cardImageWrapper, cardStyles.overlayCardImageWrapper)
                        :
                        cardStyles.cardImageWrapper
                    }
                >
                    <Image
                        source={
                            card.paymentNetwork === 'Mastercard' ?
                            require('../../assets/mastercard.png')
                            :
                            require('../../assets/visa.png')
                        }
                        style={cardStyles.cardImage}
                    />
                </View>
                <View>
                    <Text style={cardStyles.userItemContentText}>{card?.cardName}</Text>
                    <Text style={cardStyles.userItemSubContentText}>{'..' + String(card._id).slice(String(card._id).length - 4, String(card._id).length)}</Text>
                </View>
            </View>
            <View style={cardStyles.cardRightContent}>
                <Text style={cardStyles.cardBalance}>
                    {
                        `${getCurrencySymbol(card?.currency)} ${Number(card?.balance)?.toFixed(2)}`
                    }
                </Text>
                <Text style={cardStyles.cardDateText}>
                    {formatDateToMonthAndYear(card?.expiryDate)}
                </Text>
            </View>
        </TouchableOpacity>
    </>
}