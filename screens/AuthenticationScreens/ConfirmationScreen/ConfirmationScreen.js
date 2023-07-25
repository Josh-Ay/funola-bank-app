import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { confirmationStyles } from "./styles";
import { StackActions } from "@react-navigation/native";

const AccountConfirmationScreen = ({ navigation }) => {

    const handleStartBtnClick = () => {
        navigation.dispatch(
            StackActions.replace('Login')
        )
    }

    return <>
        <SafeAreaView style={confirmationStyles.wrapper}>
            <View style={confirmationStyles.container}>
                <View style={confirmationStyles.mainContent}>
                    <Image source={require('../../../assets/check-illustration.png')} style={confirmationStyles.imageContent} />
                    <View style={confirmationStyles.textContentWrapper}>
                        <Text style={Object.assign({}, confirmationStyles.successText, confirmationStyles.textContent)}>Success!</Text>
                        <Text style={Object.assign({}, confirmationStyles.textContent, confirmationStyles.successTextSubtitle)}>You have successfully registered in our app and can start working on it</Text>
                    </View>
                </View>
                <View style={confirmationStyles.bottomContent}>
                    <TouchableOpacity style={confirmationStyles.startBtn} onPress={handleStartBtnClick}>
                        <Text style={Object.assign({}, confirmationStyles.textContent, confirmationStyles.startBtnText)}>Start using</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    </>
}

export default AccountConfirmationScreen;