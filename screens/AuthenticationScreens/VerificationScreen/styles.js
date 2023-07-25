import { StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

export const verificationStyles = StyleSheet.create({
    container: {
        gap: 40,
        marginTop: 20,
    },
    resetBtn: {
        backgroundColor: colors.blue,
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    resetBtnText: {
        color: colors.white,
        fontFamily: 'Poppins',
    },
    resetText: {
        fontFamily: 'Poppins',
        color: colors.blue,
    },
    resetBtnLoading: {
        backgroundColor: colors.grey,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    inputWrapperTextItem: {
        width: 50,  
        height: 50,
    },
})
