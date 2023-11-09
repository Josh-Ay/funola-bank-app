import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate, formatDateToMonthAndDay } from "../../utils/helpers";
import { depositStyles } from "./depositStyles";

export default function DepositItem ({
    deposit, 
    modalIsOpen,
    handleDepositClick,
    isTransaction,
    transaction,
    handleTransactionClick
}) {
    if (isTransaction && transaction) return <>
    <TouchableOpacity 
            style={depositStyles.singleUserItem}
            onPress={
                handleTransactionClick && typeof handleTransactionClick === 'function' ?
                    () => handleTransactionClick(transaction)
                :
                () => {}   
            }
        >
            <View style={depositStyles.cardLeftContent}>
                <View
                    style={
                        modalIsOpen ? 
                            Object.assign({}, depositStyles.cardImageWrapper, depositStyles.overlayCardImageWrapper)
                        :
                        depositStyles.cardImageWrapper
                    }
                >
                    <MaterialCommunityIcons name="bank-outline" size={24} color="black" />
                </View>
                <View>
                    <Text style={depositStyles.userItemContentText}>{transaction?.transactionType}</Text>
                    <Text style={depositStyles.userItemSubContentText}>{transaction?.transactionRemarks}</Text>
                </View>
            </View>
            <View style={depositStyles.cardRightContent}>
                <Text 
                    style={
                        transaction?.transactionType === 'credit' ?
                            Object.assign({}, depositStyles.cardBalance, depositStyles.creditBal)
                        :
                        depositStyles.cardBalance
                    }
                >
                    {
                        `${transaction?.transactionType === 'credit' ? '+' : transaction?.transactionType === 'debit' ? '-' : ''} ${
                            transaction?.currency === 'NGN' ? 
                                '₦' 
                            : 
                            transaction?.currency === 'USD' ? 
                                '$' 
                            : 
                                ''
                            } ${Number(transaction?.amount)?.toFixed(2)}`
                    }
                </Text>
                <Text style={depositStyles.cardDateText}>
                    {formatDateToMonthAndDay(transaction?.createdAt)}
                </Text>
            </View>
        </TouchableOpacity>
    </>
    
    if (!deposit) return <></>
    
    return <>
        <TouchableOpacity 
            style={depositStyles.singleUserItem}
            onPress={
                handleDepositClick && typeof handleDepositClick === 'function' ?
                    () => handleDepositClick(deposit)
                :
                () => {}   
            }
        >
            <View style={depositStyles.cardLeftContent}>
                <View
                    style={
                        modalIsOpen ? 
                            Object.assign({}, depositStyles.cardImageWrapper, depositStyles.overlayCardImageWrapper)
                        :
                        depositStyles.cardImageWrapper
                    }
                >
                    <MaterialCommunityIcons name="bank-outline" size={24} color="black" />
                </View>
                <View>
                    <Text style={depositStyles.userItemContentText}>{'For ' + deposit?.duration + ' months'}</Text>
                    <Text style={depositStyles.userItemSubContentText}>{formatDate(deposit?.paybackDate)}</Text>
                </View>
            </View>
            <View style={depositStyles.cardRightContent}>
                <Text style={depositStyles.cardBalance}>
                    {
                        `${
                            deposit?.currency === 'NGN' ? 
                                '₦' 
                            : 
                            deposit?.currency === 'USD' ? 
                                '$' 
                            : 
                                ''
                            } ${Number(deposit?.paybackAmount)?.toFixed(2)}`
                    }
                </Text>
                <Text style={depositStyles.cardDateText}>
                    {'Rate ' + deposit.rate + '%'}
                </Text>
            </View>
        </TouchableOpacity>
    </>
}