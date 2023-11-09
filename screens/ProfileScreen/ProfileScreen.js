import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout/AppLayout";
import { Text, View } from "react-native";
import { UserServices } from "../../services/userServices";
import { useUserContext } from "../../contexts/UserContext";
import { useToast } from "react-native-toast-notifications";
import { profileStyles } from "./profileStyles";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { AuthServices } from "../../services/authServices";
import { profileSettingItems, securitySettingItems } from "./utils";
import { UserProfileItme } from "../../components/UserProfileItem/UserProfileItem";

const ProfileScreen = ({ navigation, setLoggedIn }) => {
    const {
        currentUser,
        setCurrentUser,
        userProfileLoaded,
        setUserProfileLoaded,
        setUserProfileLoading,
    } = useUserContext();
    const [ refreshing, setRefreshing ] = useState(false);
    const [ logoutLoading, setLogoutLoading ] = useState(false);
    const toast = useToast();

    const [
        userService, 
        authService
    ] = [
        new UserServices(),
        new AuthServices(),
    ]

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'normal',
            placement: 'top'
        })
    }

    useEffect(() => {
        if (!userProfileLoaded) {
            setUserProfileLoading(true);

            userService.getUserProfile().then(res => {
                setCurrentUser(res.data);
                setUserProfileLoaded(true);
                setUserProfileLoading(false);
            }).catch(err => {
                const errorMsg = err.response ? err.response.data : err.message;
                showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your details. Please refresh' : errorMsg, 'danger')
    
                setUserProfileLoading(false);
            })
        }
    }, [])

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            const res = await (await userService.getUserProfile()).data
            
            setRefreshing(false);
            setCurrentUser(res);    
        } catch (error) {
            setRefreshing(false);

            // console.log(err);
            const errorMsg = error.response ? errpr.response.data : error.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your details. Please refresh' : errorMsg, 'danger')
        }
    }

    const handleLogout = async () => {
        setLogoutLoading(true);

        try {
            const res = (await authService.logoutUser()).data;
            showToastMessage(res, 'success');

            setLogoutLoading(false);
            setLoggedIn(false);
        } catch (error) {
            // console.warn(error);
            const errorMsg = error.response ? error.response.data : error.message;

            setLogoutLoading(false);
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to log you out. Please try again' : errorMsg, 'danger')
        }
    }

    return <>
        <AppLayout
            navigation={navigation}
            pageRefreshing={refreshing}
            handlePageRefresh={handleRefresh}
        >
            <View style={profileStyles.topContentWrapper}>
                <View style={profileStyles.profileImageWrapper}>
                    {
                        currentUser?.gender === 'M' ?
                        <Image style={profileStyles.image} source={require('../../assets/man.jpg')} />
                        :
                        <Image style={profileStyles.image} source={require('../../assets/woman.jpg')} />
                    }
                </View>
                <Text style={profileStyles.username}>{currentUser?.firstName} {currentUser?.lastName}</Text>
            </View>
            <View style={profileStyles.contentWrapper}>
                <Text style={profileStyles.profileSettingHeading}>Profile settings</Text>
                <View style={profileStyles.profileOptionListing}>
                    {
                        React.Children.toArray(profileSettingItems.map(item => {
                            return <UserProfileItme 
                                item={item}
                            />
                        }))
                    }
                </View>

                <Text style={profileStyles.profileSettingHeading}>Security settings</Text>
                <View style={profileStyles.profileOptionListing}>
                    {
                        React.Children.toArray(securitySettingItems.map(item => {
                            return <UserProfileItme 
                                item={item}
                            />
                        }))
                    }
                </View>
            </View>

            <TouchableOpacity 
                style={profileStyles.logoutItem} 
                onPress={
                    logoutLoading ? 
                        () => {}
                    :
                    () => handleLogout()
                }
                disabled={logoutLoading}
            >
                <Text style={profileStyles.logoutItemText}>
                    {
                        logoutLoading ? 'Logging out...' : 'Logout'
                    }
                </Text>
            </TouchableOpacity>
        </AppLayout>
    </>
}

export default ProfileScreen;