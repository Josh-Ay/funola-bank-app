import { Text } from "react-native"
import { View } from "react-native"
import { atmItemStyles } from "./atmItemStyles"
import { Feather } from '@expo/vector-icons';

export default function SingleAtmItem ({ item }) {
    if (!item) return <></>

    return <>
        <View style={atmItemStyles.wrapper}>
            <View style={atmItemStyles.iconWrapper}>
                <Feather name="map-pin" size={24} color="black" />
            </View>
            <View>
                <Text style={atmItemStyles.itemName}>{item?.name}</Text>
                <Text style={atmItemStyles.itemDistance}>{item?.distance} metres</Text>
            </View>
        </View>
    </>
}