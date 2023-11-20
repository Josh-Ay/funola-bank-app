import { SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../../utils/colors";
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from "../../contexts/UserContext";
import { useEffect, useState } from "react";
import { UserServices } from "../../services/userServices";
import { notificationStyles } from "./notificationStyles";
import { FlatList } from "react-native";
import { formatDateToMonthAndDay } from "../../utils/helpers";

const NotificationItem = ({ item }) => {
    if (!item.content) return <></>
    return <>
        <View style={notificationStyles.notificationItem}>
            <View>
                <Ionicons name="checkmark-done-circle" size={24} color={colors.blue} />
            </View>
            <View style={notificationStyles.itemTextWrapper}>
                <Text style={notificationStyles.notificationItemText}>{item.content}</Text>
                <Text style={notificationStyles.notificationItemDate}>{formatDateToMonthAndDay(item.createdAt)}</Text>
            </View>
            
        </View>
    </>
}

const NotificationScreen = ({ navigation }) => {
    const {
        notifications,
        setNotifications,
    } = useUserContext();

    const userService = new UserServices();
    const [ unreadNotifications, setUnreadNotifications ] = useState([]);

    useEffect(() => {

        if (notifications.length < 1) {
            userService.getNotifications().then(res => {
                setNotifications(res.data)
            }).catch(err => {
                console.log('Error fetching notifications');
            })
        }

    }, [])

    useEffect(() => {
        setUnreadNotifications(notifications.filter(notification => !notification.read))
    }, [notifications])

    return <>
        <SafeAreaView style={{ flex: 1, marginTop: 30 }}>
            <View style={notificationStyles.titleWrapper}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Ionicons name="chevron-back" size={24} color={colors.black} />
                </TouchableOpacity>
                <Text style={notificationStyles.title}>Notifications</Text>
                <Text style={notificationStyles.subtitle}>View details about actions on your account</Text>
            </View>
            
            <FlatList
                data={notifications && Array.isArray(notifications) ? notifications : []}
                renderItem={
                    ({item}) => 
                    <NotificationItem 
                        item={item} 
                    />
                }
                keyExtractor={item => item._id}
                contentContainerStyle={notificationStyles.notifications}
                initialNumToRender={10}
            />
        </SafeAreaView>
    </>
}

export default NotificationScreen;