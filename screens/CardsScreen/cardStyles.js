import { Platform, StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

const cardIndicatorSize = 10;

export const cardScreenStyles = StyleSheet.create({
    topContentWrapper: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: Platform.OS === "ios" ? 30 : 40,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    topTitleText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 26,
    },
    topSubtitleText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: colors.grey,
    },
    cardTypeSelection: {
        paddingLeft: 25,
        paddingRight: 25,
        flexDirection: 'row',
        gap: 15,
    },
    cardTypeSelectionItem: {
        backgroundColor: colors.white,
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 18,
        paddingRight: 18,
    },
    activeCardType: {
        fontFamily: 'Poppins',
        fontSize: 13,
        color: colors.deepBlue,
    },
    cardTypeText: {
        fontFamily: 'Poppins',
        fontSize: 13,
        color: colors.lightGrey,
    },
    cardsListing: {
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: 30,
        marginBottom: 15,
        gap: 15,
    },
    noCardWrapper: {
        marginTop: 30,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noCardsText: {
        fontFamily: 'Poppins',
    },
    cardsIndicatorWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        flexDirection: 'row',
    },
    cardIndicator: {
        width: cardIndicatorSize,
        height: cardIndicatorSize,
        borderRadius: cardIndicatorSize / 2,
        backgroundColor: colors.lightGrey,
    },
    activeCardIndicator: {
        backgroundColor: colors.blue,
    },
    cardSettingsWrapper: {
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: 20,
        gap: 15,
        marginBottom: 20,
    },
    cardSettingsTitle: {
        fontFamily: 'Poppins-Medium',
        color: colors.deepBlue,
        fontSize: 18,
    }
})