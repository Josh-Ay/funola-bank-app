import { StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

export const registrationStyles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
    },
    headerText: {
        fontFamily: 'Poppins',
        marginBottom: 15,
    },
    splitItemWrapper: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        height: 45,
        borderRadius: 10,
        backgroundColor: colors.white,
    },
    dropdownStyle: {
        flex: 0.2,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    verticalLine: {
        height: '50%',
        width: 1,
        backgroundColor: colors.grey,
        alignSelf: 'center'
    },
    textItem: {
        flex: 1,
        height: '100%',
        width: '10%',
    },
    locationText: {
        width: '80%',
        justifyContent: 'center'
    },
});