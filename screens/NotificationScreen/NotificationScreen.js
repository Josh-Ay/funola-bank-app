import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"

const NotificationScreen = ({ navigation }) => {
    return <>
        <SafeAreaView style={{ flex: 1, marginTop: 30 }}>
            <View>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Text>Back</Text>
                </TouchableOpacity>
                <Text>Notifications</Text>
            </View>
            
            <ScrollView>

            </ScrollView>
        </SafeAreaView>
    </>
}

export default NotificationScreen;