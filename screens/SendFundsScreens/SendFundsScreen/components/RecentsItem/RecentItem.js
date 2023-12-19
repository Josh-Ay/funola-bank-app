import { Text, TouchableOpacity, View } from "react-native"
import { sendFundStyles } from "../../sendFundStyles"
import { AntDesign } from '@expo/vector-icons';

export default RecentItem = ({ item }) => {
    return <>
        <TouchableOpacity style={sendFundStyles.recentUserItem}>
            <AntDesign name="user" size={50} color="black" />

            <View>
                <Text style={sendFundStyles.recentUsername}>Hello</Text>
                <Text style={sendFundStyles.recentUserNumber}>+234940248920934</Text>
            </View>
        </TouchableOpacity>
    </>
}
