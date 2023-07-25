import { StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

export const onboardingStyles = StyleSheet.create({
    container: {
        gap: 30,
        // flex: 1,
        marginBottom: 20,
    },
    headerText: {
        fontFamily: 'Poppins',
        marginBottom: 15,
    },
    eyeBtn: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center', 
        alignItems: 'center',
        width: 24,
    },
    dateLabelText: {
        color: colors.blue,
        fontFamily: 'Poppins'
    },
    datePickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 25,
        justifyContent: 'flex-start',
    },
    dateValueText: {
        fontFamily: 'Poppins',
        color: colors.grey
    },
    selectItemWrapper: {
        width: 80,
        height: 50,
        borderRadius: 10,
    }
})