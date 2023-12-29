import { Text, TouchableOpacity, View } from "react-native"
import { sendFundStyles } from "../../sendFundStyles"
import { AntDesign } from '@expo/vector-icons';
import UserProfileImage from "../../../../../components/UserProfileImage/UserProfileImage";

export default RecentItem = ({ item, handleSelectRecent }) => {
    return <>
        <TouchableOpacity 
            style={sendFundStyles.recentUserItem} 
            onPress={
                handleSelectRecent && typeof handleSelectRecent === 'function' ?
                    () => handleSelectRecent(item)
                :
                    () => {}
            }
        >
            <UserProfileImage 
                user={{ gender: item?.userGender }}
                pressable={false}
                imageStyle={sendFundStyles.recentUserImageWrapper}
            />
            {/* <AntDesign name="user" size={50} color="black" /> */}

            <View>
                <Text style={sendFundStyles.recentUsername}>{item?.nameOfUser}</Text>
                <Text style={sendFundStyles.recentUserNumber}>{item?.userPhoneNumberExtension}{item?.userPhoneNumber}</Text>
            </View>
        </TouchableOpacity>
    </>
}
