import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { userProfileItemStyles } from "./userProfileItemStyles";
import { colors } from "../../utils/colors";

export function UserProfileItem({ item, dangerItem, handleItemClick }) {
    return <TouchableOpacity 
        style={userProfileItemStyles.wrapper}
        onPress={
            handleItemClick && typeof handleItemClick === 'function' ?
                () => handleItemClick(item?.action)
            :
            () => {}   
        }
    >
        <View style={userProfileItemStyles.leftContent}>
            {item?.icon}
            <View>
                <Text 
                    style={
                        dangerItem ?
                            Object.assign({}, userProfileItemStyles.title, userProfileItemStyles.redColorText)
                        :
                        userProfileItemStyles.title
                    }
                >
                    {item?.title}
                </Text>
                <Text 
                    style={
                        dangerItem ?
                            Object.assign({}, userProfileItemStyles.subtitle, userProfileItemStyles.fadedRedColorText)
                        :
                        userProfileItemStyles.subtitle
                    }
                >
                    {item?.subtitle}
                </Text>
            </View>
        </View>
        <View>
            <Ionicons 
                name="chevron-forward-outline" 
                size={20} 
                color={
                    dangerItem ? 
                        colors.red 
                    : 
                    "black"
                } 
            />
        </View>
    </TouchableOpacity>
}