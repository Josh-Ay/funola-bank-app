import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const atmItemStyles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 40,
        shadowColor: colors.black,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 7,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    iconWrapper: {
        backgroundColor: colors.paleBlue,
        padding: 10,
        borderRadius: 7,
    },
    itemName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: colors.deepBlue,
    },
    itemDistance: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: colors.grey,
    },
})