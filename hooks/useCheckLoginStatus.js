import { useEffect } from "react";
import { AuthServices } from "../services/authServices";

export default function useCheckLoginStatus (
    appLoaded, 
    currentLoggedInStatus, 
    updateUserLoggedInStatus, 
    updateStatusCheckedValue
) {
    /**
     * Checks whether or not a user is still logged in
     * 
     * @param appLoaded Variable to check if the app is ready
     * @param currentLoggedInStatus Variable to track if the user is currently logged in
     * @param updateUserLoggedInStatus Function to update whether or not a user is logged in
     * @param updateStatusCheckedValue Function to update whether or not the login status of user has been checked
     * 
     */
    
    useEffect(() => {
        
        if (!appLoaded) return
        if (currentLoggedInStatus) return

        const authService = new AuthServices();

        authService.getLoginStatus().then(res => {
            // console.log('Login status response: ', res.data);
            updateUserLoggedInStatus(true);
            updateStatusCheckedValue(true);
        }).catch(err => {
            // console.warn(err.response ? err.response.data : err.message);
            updateUserLoggedInStatus(false);
            updateStatusCheckedValue(true);
        })

    }, [appLoaded, currentLoggedInStatus])
}