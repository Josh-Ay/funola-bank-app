import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const pinFormStyles = StyleSheet.create({
    numberWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 3,
        paddingRight: 3,
    },
    blankNumberBtn: {
        width: '30%',
        height: 58,
    },
    numberBtn: {
        width: '30%',
        marginBottom: 20,
        backgroundColor: colors.paleBlue,
        height: 58,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberBtnText: {
        fontFamily: 'Poppins',
    },
    pinDisplay: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
        marginBottom: 22,
    },
    filledPinDisplay: {
        width: 18,
        height: 18,
        backgroundColor: colors.blue,
        borderRadius: 18 / 2
    },
    unFilledPinDisplay: {
        width: 18,
        height: 18,
        backgroundColor: colors.paleBlue,
        borderRadius: 18 / 2
    },
})