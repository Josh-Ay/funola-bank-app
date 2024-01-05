import { useEffect } from "react";
import { USER_DETAIL_KEY, getSavedUserTimeoutDetail } from "../utils/utils";
import { UserServices } from "../services/userServices";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useCheckIfTimeToLockApp(
    userLoggedIn,
    updateUserDetails,
    updateAppLocked,
) {
    const saveDetailsToStorage = async () => {
        const userService = new UserServices()

        const today = new Date();

        try {
            const userDetail = (await userService.getUserProfile()).data;

            const userDetailToSave = {
                name: `${userDetail?.firstName} ${userDetail?.lastName}`,
                gender: userDetail?.gender,
                currentSessionTimeout: today.setMinutes(today.getMinutes() + 30)
            }

            await AsyncStorage.setItem(USER_DETAIL_KEY, JSON.stringify(userDetailToSave));
                
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!userLoggedIn) return

        const interval = setInterval(() => {
            getSavedUserTimeoutDetail().then(async (res) => {
            
                if (!res) {
                    await saveDetailsToStorage();
                    return
                }
    
                const today = new Date();
    
                if (today.getTime() > res?.currentSessionTimeout) {
                    updateUserDetails({
                        name: res?.name,
                        gender: res?.gender,
                    })
    
                    updateAppLocked(true);
                }
                
            }).catch(async (err) => {
                await saveDetailsToStorage()
            })
        }, 60000)

        return (() => {
            clearInterval(interval);
        })
        
    }, [userLoggedIn])
}