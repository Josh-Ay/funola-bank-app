import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { userProfileItemStyles } from "./userProfileItemStyles";

export function UserProfileItme({ item }) {
    return <TouchableOpacity style={userProfileItemStyles.wrapper}>
        <View style={userProfileItemStyles.leftContent}>
            {item?.icon}
            <View>
                <Text style={userProfileItemStyles.title}>{item?.title}</Text>
                <Text style={userProfileItemStyles.subtitle}>{item?.subtitle}</Text>
            </View>
        </View>
        <View>
            <Ionicons name="ios-chevron-forward-outline" size={20} color="black" />
        </View>
    </TouchableOpacity>
}