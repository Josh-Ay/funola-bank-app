import { useState } from "react";
import AppLayout from "../../layouts/AppLayout/AppLayout";
import { Text, View } from "react-native";

const MapsScreen = ({ navigation }) => {
    const [ refreshing, setRefreshing ] = useState(false);

    const handleRefresh = async () => {

    }

    return <>
        <AppLayout
            navigation={navigation}
            pageRefreshing={refreshing}
            handlePageRefresh={handleRefresh}
        >
            <View>
                <Text>Maps</Text>
            </View>
        </AppLayout>
    </>
}

export default MapsScreen;