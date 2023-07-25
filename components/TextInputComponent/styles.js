import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const textInputStyles = StyleSheet.create({
    inputElement: {
        fontFamily: 'Poppins',
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 12,
        paddingRight: 12,
        shadowColor: colors.black,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 7,
        elevation: 2,
    },
    passwordInputElement: {
        paddingRight: 38,
    },
    focused: {
        borderColor: colors.blue,
        borderWidth: 0.5,
    },
    invalid: {
        borderColor: colors.red,
        borderWidth: 0.5,
    },
})