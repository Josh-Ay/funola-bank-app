import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const userProfileItemStyles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 15,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    title: {
        fontFamily: 'Poppins',
        color: colors.deepBlue,
        fontSize: 14,
        marginBottom: 3,
    },
    subtitle: {
        fontFamily: 'Poppins',
        color: colors.grey,
        fontSize: 11,
    },
})