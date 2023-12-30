import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../../../utils/colors";
import { Ionicons } from '@expo/vector-icons';
import { transactionStyles } from "../transactionStyles";
import { Text } from "react-native";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import DepositItem from "../../../components/DepositItem/DepositItem";
import { Dimensions } from "react-native";
import NavigationTabFilterItem from "../../../components/NavigationTabFilterItem/NavigationTabFilterItem";
import { useWalletContext } from "../../../contexts/WalletContext";
import { WalletServices } from "../../../services/walletServices";
import LoadingIndicator from "../../../components/LoadingIndicator/LoadingIndicator";

const { height } = Dimensions.get('window');


const AllTransactionsScreen = ({ navigation, route }) => {
    const [ transactions, setTransactions ] = useState([]);
    const [ showRedeemedDeposits, setShowRedeemedDeposits ] = useState(false);
    const [ transactionsLoading, setTransactionsLoading ] = useState(false);
    const {
        walletTransactions, 
        setWalletTransactions,
    } = useWalletContext();

    const walletService = new WalletServices();

    useEffect(() => {
        const [
            passedTransactions,
            passedWallet,
            showWalletTransactions,
        ] = [
            route?.params?.transactions,
            route?.params?.wallet,
            route?.params?.showWalletTransaction
        ]

        if (!passedTransactions && !showWalletTransactions === true) {
            navigation.pop();
            return
        }

        if (passedTransactions && Array.isArray(passedTransactions)) setTransactions(passedTransactions);

        if (showWalletTransactions === true && passedWallet) {
            if (walletTransactions[passedWallet?._id]) {
                setTransactions(walletTransactions[passedWallet?._id]?.transactions)
                return
            }

            setTransactionsLoading(true);

            const copyOfWalletTransactions = {...walletTransactions};

            walletService.getWalletTransactions(passedWallet?._id).then(res => {
                setTransactions(res.data);

                copyOfWalletTransactions[passedWallet?._id] = {
                    transactions: res.data
                }
                setWalletTransactions(copyOfWalletTransactions);
                setTransactionsLoading(false);

            }).catch(err => {
                // console.log('Err fetching wallet transactions: ', err);
                setTransactionsLoading(false);
            })
        }
    }, [])

    return <>
        <SafeAreaView style={{ flex: 1, marginTop: 30 }}>
            <View style={transactionStyles.wrapper}>
                <View style={transactionStyles.allTransactionsHeader}>
                    <TouchableOpacity onPress={() => navigation.pop()}>
                        <Ionicons name="chevron-back" size={24} color={colors.black} />
                    </TouchableOpacity>
                    <View style={transactionStyles.allTransactionsTitleHeader}>
                        <Text style={transactionStyles.allTransactionsHeaderTitle}>{route?.params?.typeOfItem === 'deposit' ? 'Deposits' : 'Transactions'}</Text>
                        <Text style={transactionStyles.allTransactionsHeaderSubtitle}>
                            {
                                route?.params?.typeOfItem === 'deposit' ? 
                                    <>Showing all deposits</> : 
                                    <>Showing all transactions for {route?.params?.typeOfItem}{route?.params?.title && ` with title: ${route?.params?.title}` }</>
                            }
                        </Text>
                    </View>
                </View>

                {
                    route?.params?.typeOfItem === 'deposit' &&
                    <NavigationTabFilterItem 
                        firstFilterItem={'Ongoing'}
                        firstFilterItemActive={!showRedeemedDeposits}
                        handleFirstFilterItemClick={
                            () => setShowRedeemedDeposits(false)
                        }
                        secondFilterItem={'Matured'}
                        secondFilterItemActive={showRedeemedDeposits}
                        handleSecondFilterItemClick={
                            () => setShowRedeemedDeposits(true)
                        }
                    />
                }

                <View style={{ maxHeight: height * 0.7 }}>
                    {
                        transactionsLoading ? <>
                            <LoadingIndicator 
                                loadingContent={'Fetching transactions'}
                            />
                        </> 
                        :
                        <FlatList
                            data={
                                route?.params?.typeOfItem === 'deposit' ?
                                        !showRedeemedDeposits ? transactions.filter(transaction => new Date() < new Date(transaction?.paybackDate))
                                    :
                                    transactions.filter(transaction => new Date() >= new Date(transaction?.paybackDate))
                                :
                                transactions
                            }
                            renderItem={
                                ({item}) => 
                                <DepositItem 
                                    transaction={route?.params?.typeOfItem === 'deposit' ? null : item}
                                    deposit={route?.params?.typeOfItem === 'deposit' ? item : null}
                                    isTransaction={route?.params?.typeOfItem === 'deposit' ? false : true}
                                    handleTransactionClick={
                                        () => navigation.navigate('SingleTransaction', 
                                            { 
                                                transactionItem: item,
                                            }
                                        )
                                    }
                                    handleDepositClick={
                                        () => navigation.navigate('SingleTransaction', 
                                            { 
                                                transactionItem: item,
                                                typeOfItem: 'deposit',
                                            }
                                        )
                                    }
                                />
                            }
                            keyExtractor={(item, index) => item._id}
                            contentContainerStyle={{
                                paddingTop: 10,
                                paddingBottom: 30,
                            }}
                        />
                    }
                </View>
                
            </View>
        </SafeAreaView>
    </>
}

export default AllTransactionsScreen;