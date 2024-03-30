import AccountConfirmationScreen from "../screens/AuthenticationScreens/ConfirmationScreen/ConfirmationScreen";
import LoginScreen from "../screens/AuthenticationScreens/LoginScreen/LoginScreen";
import OnboardingScreen from "../screens/AuthenticationScreens/OnboardingScreen/OnboardingScreen";
import PasswordResetScreen from "../screens/AuthenticationScreens/PasswordReset/PasswordResetScreen";
import RegistrationScreen from "../screens/AuthenticationScreens/RegistrationScreen/RegistrationScreen";
import VerificationScreen from "../screens/AuthenticationScreens/VerificationScreen/VerificationScreen";
import WelcomeScreen from "../screens/WelcomeScreen/WelcomeScreen";

export const nonLoggedInuserRoutes = [
    {
        routeName: 'Welcome',
        component: WelcomeScreen,
    },
    {
        routeName: 'Registration',
        component: RegistrationScreen,
    },
    {
        routeName: 'Login',
        component: LoginScreen,
        hasProps: true,
    },
    {
        routeName: 'PasswordReset',
        component: PasswordResetScreen,
    },
    {
        routeName: 'Verification',
        component: VerificationScreen,
    },
    {
        routeName: 'Onboarding',
        component: OnboardingScreen,
    },
    {
        routeName: 'AccountConfirmation',
        component: AccountConfirmationScreen,
    },
]