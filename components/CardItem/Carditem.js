import { Image, Text, TouchableOpacity, View } from 'react-native';
import { formatDateToMonthAndYear } from '../../utils/helpers';
import { cardStyles } from './cardStyles';

export default function CardItem ({ 
    card, 
    modalIsOpen,
    handleCardClick,
}) {
    if (!card) return <></>

    return <>
        <TouchableOpacity 
            style={cardStyles.singleUserItem}
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
                        `${
                            card?.currency === 'NGN' ? 
                                '₦' 
                            : 
                            card?.currency === 'USD' ? 
                                '$' 
                            : 
                                ''
                            } ${Number(card?.balance)?.toFixed(2)}`
                    }
                </Text>
                <Text style={cardStyles.cardDateText}>
                    {formatDateToMonthAndYear(card?.expiryDate)}
                </Text>
            </View>
        </TouchableOpacity>
    </>
}