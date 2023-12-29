import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const tabFilterStyles = StyleSheet.create({
    filterWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterItem: {
        gap: 7,
        flex: 0.5,
    },
    filterItemText: {
        fontFamily: 'Poppins',
        textAlign: 'center',
        color: colors.grey,
    },
    activeFilter: {
        color: colors.blue,
    },
    filterIndicator: {
        height: 3,
        backgroundColor: colors.lightGrey,
    },
    blueFilterIndicator: {
        backgroundColor: colors.blue,
    },
})