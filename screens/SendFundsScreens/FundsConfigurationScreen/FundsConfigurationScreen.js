import { FlatList, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../utils/colors";
import { configureFundStyles } from "./configureFundStyles";
import { View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { AntDesign } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";
import { useState } from "react";
import QuickFundItem from "./components/QuickFundItem";

const quickFundsOptions = [
    {
        id: '11',
        option: 100,
    }, 
    {
        id: '22',
        option: 200,
    },
    {
        id: '33',
        option: 300,
    },
    {
        id: '44',
        option: 450,
    },
    {
        id: '55',
        option: 500,
    },
    {
        id: '66',
        option: 600
    },
]

const FundsConfigurationScreen = ({ navigation, route }) => {
    const [ amountToSend, setAmountToSend ] = useState('10');
    const [ currency, setCurrency ] = useState('$');

    const handleSendFund = () => {
        if (!amountToSend || amountToSend.length < 1 || isNaN(amountToSend)) return

        console.log(amountToSend);
    }
    return <>
    
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paleBlue }}>
            <View style={configureFundStyles.topContentWrapper}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={configureFundStyles.topContent}>
                    <Text style={configureFundStyles.titleText}>Send money</Text>
                    <Text style={configureFundStyles.subtitleText}>How much will you like to send?</Text>
                    
                </View>
            </View>

            <View style={configureFundStyles.contentWrapper}>
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
                            <Text style={configureFundStyles.amountText}>{currency}</Text>
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
                                    currency={currency}
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

                </View>
            </View>

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
        </SafeAreaView>
    </>
}

export default FundsConfigurationScreen;