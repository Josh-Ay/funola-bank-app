import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout/AppLayout";
import { Linking, Text, View } from "react-native";
import { UserServices } from "../../services/userServices";
import { useUserContext } from "../../contexts/UserContext";
import { useToast } from "react-native-toast-notifications";
import { profileStyles } from "./profileStyles";
import { TouchableOpacity } from "react-native";
import { AuthServices } from "../../services/authServices";
import { bankSettingItems, helpSettingItems, profileSettingItems, securitySettingItems, userProfileActions } from "./utils";
import { UserProfileItem } from "../../components/UserProfileItem/UserProfileItem";
import UserProfileImage from "../../components/UserProfileImage/UserProfileImage";

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

    const handleSelectProfileItem = (item) => {
        switch (item) {
            case userProfileActions.nameChange:
            case userProfileActions.phoneChange:
            case userProfileActions.emailChange:
            case userProfileActions.passwordChange:
            case userProfileActions.loginPinChange:
            case userProfileActions.transactionPinChange:
            case userProfileActions.viewBanks:
                navigation.navigate('ProfileUpdate', {
                    updateType: item,
                })
                break;
            case userProfileActions.selfHelp:
                showToastMessage('Feature coming soon!')
                break;
            case userProfileActions.contactUs:
                Linking.openURL('mailto:funola.cares@gmail.com');
                break;
            default:
                console.log('item action not defined yet');
                break;
        }
    }

    return <>
        <AppLayout
            navigation={navigation}
            pageRefreshing={refreshing}
            handlePageRefresh={handleRefresh}
        >
            <View style={profileStyles.topContentWrapper}>
                <UserProfileImage 
                    user={currentUser}
                    wrapperStyle={profileStyles.profileImageWrapper}
                    imageStyle={profileStyles.image}
                />
                <Text style={profileStyles.username}>{currentUser?.firstName} {currentUser?.lastName}</Text>
            </View>
            <View style={profileStyles.contentWrapper}>
                <Text style={profileStyles.profileSettingHeading}>Profile settings</Text>
                <View style={profileStyles.profileOptionListing}>
                    {
                        React.Children.toArray(profileSettingItems.map(item => {
                            return <UserProfileItem 
                                item={item}
                                handleItemClick={(action) => handleSelectProfileItem(action)}
                            />
                        }))
                    }
                </View>

                <Text style={profileStyles.profileSettingHeading}>Security settings</Text>
                <View style={profileStyles.profileOptionListing}>
                    {
                        React.Children.toArray(securitySettingItems.map(item => {
                            return <UserProfileItem 
                                item={item}
                                dangerItem={item?.type === 'danger' ? true : false}
                                handleItemClick={(action) => handleSelectProfileItem(action)}
                            />
                        }))
                    }
                </View>

                <Text style={profileStyles.profileSettingHeading}>Bank settings</Text>
                <View style={profileStyles.profileOptionListing}>
                    {
                        React.Children.toArray(bankSettingItems.map(item => {
                            return <UserProfileItem 
                                item={item}
                                handleItemClick={(action) => handleSelectProfileItem(action)}
                            />
                        }))
                    }
                </View>

                <Text style={profileStyles.profileSettingHeading}>Contact and Help</Text>
                <View style={profileStyles.profileOptionListing}>
                    {
                        React.Children.toArray(helpSettingItems.map(item => {
                            return <UserProfileItem 
                                item={item}
                                handleItemClick={(action) => handleSelectProfileItem(action)}
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