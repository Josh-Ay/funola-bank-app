import { useEffect, useState } from "react";
import { colors } from "../../../utils/colors";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { transactionStyles } from "../transactionStyles";
import { formatDateToMonthAndDay, getCurrencySymbol, getDateHoursAndMinutes } from "../../../utils/helpers";
import { Image } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const SingleTransactionScreen = ({ route, navigation }) => {
    const [ currentTransaction, setCurrentTransaction ] = useState(null);

    useEffect(() => {
        if (!route?.params?.transactionItem) {
            navigation.pop();
            return
        }

        setCurrentTransaction(route?.params?.transactionItem);
    }, [])

    return <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, marginTop: 30, marginBottom: 30 }}>
            <View style={transactionStyles.wrapper}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Ionicons name="chevron-back" size={24} color={colors.black} />
                </TouchableOpacity>

                <View style={transactionStyles.transactionHeaderWrap}>
                    <View style={transactionStyles.logoWrap}>
                        <Image
                            source={require('../../../assets/logo/logo-no-bg.png')} 
                            style={transactionStyles.logo}
                        />
                        <Text style={transactionStyles.logoText}>Funola</Text>
                    </View>
                    <Text style={transactionStyles.receiptText}>Transaction Receipt</Text>
                </View>

                <View style={transactionStyles.singleTransactionItemWrap}>
                    {
                        route?.params?.typeOfItem === 'deposit' ?
                            <>
                                {
                                    new Date() < new Date(currentTransaction?.paybackDate) ? 
                                    <>
                                        <MaterialCommunityIcons name="bank-outline" size={80} color={colors.black} />                
                                    </> 
                                        : 
                                    <>
                                        <Ionicons name="checkmark-done-circle" size={80} color={colors.blue} />
                                    </>
                                }                        
                            </>
                        :
                        <>
                            <Ionicons name="checkmark-done-circle" size={80} color={colors.blue} />
                        </>
                    }
                    <View style={transactionStyles.amountDetailWrap}>
                        <Text style={
                            Object.assign(
                                {},
                                transactionStyles.amount,
                                currentTransaction?.transactionType === 'credit' ? 
                                    transactionStyles.greenText : 
                                (currentTransaction?.transactionType === 'debit' || currentTransaction?.transactionType === 'transfer') ? 
                                    transactionStyles.redText : 
                                {}
                            )
                        }>
                            {
                                `${currentTransaction?.transactionType === 'credit' ? '+' : (currentTransaction?.transactionType === 'debit' || currentTransaction?.transactionType === 'transfer') ? '-' : ''} ${
                                    getCurrencySymbol(currentTransaction?.currency)
                                }${route?.params?.typeOfItem === 'deposit' ? Number(currentTransaction?.paybackAmount).toFixed(2) : currentTransaction?.amount}`
                            }
                        </Text>
                        <Text style={transactionStyles.statusText}>
                            {
                                route?.params?.typeOfItem === 'deposit' ?
                                <>
                                    {new Date() < new Date(currentTransaction?.paybackDate) ? 'Pending' : 'Redeemed'}                        
                                </>
                                :
                                <>                             
                                    {currentTransaction?.status}
                                </>
                            }
                        </Text>
                        <Text style={transactionStyles.dateOfTransaction}>
                            {route?.params?.typeOfItem === 'deposit' && 'Payback Date: '} 
                            {
                                route?.params?.typeOfItem === 'deposit' ? 
                                <>
                                    {formatDateToMonthAndDay(currentTransaction?.paybackDate)} {new Date(currentTransaction?.paybackDate).getFullYear()}, {getDateHoursAndMinutes(currentTransaction?.paybackDate)}                        
                                </>
                                :
                                <>
                                    {formatDateToMonthAndDay(currentTransaction?.createdAt)} {new Date(currentTransaction?.createdAt).getFullYear()}, {getDateHoursAndMinutes(currentTransaction?.createdAt)}
                                </>
                            }
                        </Text>
                    </View>
                    
                    <View style={transactionStyles.divider}></View>

                    {
                        route?.params?.typeOfItem === 'deposit' ?
                        <>

                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Deposit Amount</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{currentTransaction?.depositAmount}</Text>
                            </View>
                            
                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Rate</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{currentTransaction?.rate}%</Text>
                            </View>

                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Duration</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{currentTransaction?.duration} {currentTransaction?.duration > 1 ? 'months' : 'month'}</Text>
                            </View>

                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Date Created</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{formatDateToMonthAndDay(currentTransaction?.createdAt)} {new Date(currentTransaction?.createdAt).getFullYear()}, {getDateHoursAndMinutes(currentTransaction?.createdAt)}</Text>
                            </View>

                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Payback Date</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{formatDateToMonthAndDay(currentTransaction?.paybackDate)} {new Date(currentTransaction?.paybackDate).getFullYear()}, {getDateHoursAndMinutes(currentTransaction?.paybackDate)}</Text>
                            </View>

                            
                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Payment Method</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{currentTransaction?.paymentMethod}</Text>
                            </View>

                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Transaction Reference</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{currentTransaction?._id}</Text>
                            </View>
                        </>
                        
                        :

                        <>
                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Transaction Type</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{currentTransaction?.transactionType}</Text>
                            </View>

                            
                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Remarks</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{currentTransaction?.transactionRemarks}</Text>
                            </View>

                            <View style={transactionStyles.transactionDetailItem}>
                                <Text style={transactionStyles.transactionDetailItemText}>Transaction Reference</Text>
                                <Text style={transactionStyles.transactionDetailItemText}>{currentTransaction?._id}</Text>
                            </View>
                        </>
                    }
                    
                </View>
                
                <View style={transactionStyles.supportWrap}>
                    <Text style={transactionStyles.supportTitle}>Support</Text>
                    <Text style={transactionStyles.supportEmail}>funola.cares@gmail.com</Text>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
}


export default SingleTransactionScreen;