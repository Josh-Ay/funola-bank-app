import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const userActionItemStyles = StyleSheet.create({
    singleActionItem: {
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 30,
    },
    actionItemIcon: {
        backgroundColor: colors.paleBlue,
        borderRadius: 8,
        padding: 12,
        width: 55,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionItemText: {
        fontFamily: 'Poppins',
        color: colors.lightGrey,
        fontSize: 12,
    },
})