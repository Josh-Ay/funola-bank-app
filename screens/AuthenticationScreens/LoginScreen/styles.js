import { StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
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
    resetPasswordText: {
        fontFamily: 'Poppins',
        textAlign: 'center',
        color: colors.blue,
        marginTop: 10,
    }
})