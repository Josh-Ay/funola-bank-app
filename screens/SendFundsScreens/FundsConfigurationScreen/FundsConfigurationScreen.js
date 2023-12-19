import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../utils/colors";
import { configureFundStyles } from "./configureFundStyles";
import { View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { AntDesign } from '@expo/vector-icons';
import Slider from "@react-native-community/slider";


const FundsConfigurationScreen = ({ navigation, route }) => {
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
                                () => {}
                            }
                            style={configureFundStyles.amountBtn}
                        >
                            <AntDesign name="minus" size={24} color={colors.grey} />
                        </TouchableOpacity>
                        <TextInputComponent 
                            value={'$' + '500'}
                            style={configureFundStyles.amountText}
                        />
                        <TouchableOpacity
                            onPress={
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
                        value={100}
                        onValueChange={(val) => console.log(val)}
                        step={100}
                        lowerLimit={100}
                        upperLimit={1000}
                    />
                </View>

                <View style={configureFundStyles.selectDebitAccount}>
                    <Text style={configureFundStyles.itemContentTitle}>
                        Select your account
                    </Text>

                </View>
            </View>

            <View style={configureFundStyles.actionsWrap}>
                <TouchableOpacity style={configureFundStyles.cancelActionBtn} onPress={() => navigation.pop()}>
                    <Text style={configureFundStyles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={configureFundStyles.sendActionBtn}>
                    <Text style={configureFundStyles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    </>
}

export default FundsConfigurationScreen;