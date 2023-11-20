import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const notificationStyles = StyleSheet.create({
    titleWrapper: {
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 30,
    },
    title: {
        fontFamily: 'Poppins-Medium',
        fontSize: 26,
        marginTop: 10,
    },
    subtitle: {
        fontFamily: 'Poppins',
        color: colors.grey,
    },
    notifications: {
        paddingLeft: 25,
        paddingRight: 25,
        gap: 20,
        paddingBottom: 20,
    },
    notificationItem: {
        alignItems: 'flex-start',
        gap: 15,
        backgroundColor: colors.paleBlue,
        padding: 15,
        borderRadius: 6,
    },
    itemTextWrapper: { 
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    notificationItemText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        flex: 0.85,
        flexShrink: 1,
    },
    notificationItemDate: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: colors.grey,
    },
})