import { Text, TouchableOpacity } from "react-native"
import { configureFundStyles } from "../configureFundStyles"

export default QuickAmountItem = ({ item, handlePress, currency }) => {
    return <>
        <TouchableOpacity
            onPress={() => handlePress(item.option)}
            style={configureFundStyles.quickAmountBtn}
        >
            <Text style={configureFundStyles.quickAmountText}>{currency}{item.option}</Text>
        </TouchableOpacity>
    </>
}