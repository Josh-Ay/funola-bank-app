import CardSettingsScreen from "../screens/CardSettingsScreen/CardSettingsScreen";
import CardsScreen from "../screens/CardsScreen/CardsScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import MapsScreen from "../screens/MapsScreen/MapsScreen";
import NotificationScreen from "../screens/NotificationScreen/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import { ProfileUpdateScreen } from "../screens/ProfileUpdateScreen/ProfileUpdateScreen";
import RequestFundsScreen from "../screens/RequestFundsScreens/RequestFundsScreen";
import FundsConfigurationScreen from "../screens/SendFundsScreens/FundsConfigurationScreen/FundsConfigurationScreen";
import FundsConfirmationScreen from "../screens/SendFundsScreens/FundsConfirmationScreen/FundsConfirmationScreen";
import SendFundsScreen from "../screens/SendFundsScreens/SendFundsScreen/SendFundsScreen";
import AllTransactionsScreen from "../screens/TransactionsScreens/AllTransactionsScreen/AllTransactionsScreen";
import SingleTransactionScreen from "../screens/TransactionsScreens/SingleTransactionScreen/SingleTransactionScreen";

export const loggedInUserRoutes = [
    {
        routeName: 'Home',
        component: HomeScreen,
        hasOptions: true,
        options: {
            gestureEnabled: false,
        }
    },
    {
        routeName: 'Cards',
        component: CardsScreen,
    },
    {
        routeName: 'CardSettings',
        component: CardSettingsScreen,
    },
    {
        routeName: 'Map',
        component: MapsScreen,
    },
    {
        routeName: 'Profile',
        component: ProfileScreen,
        hasProps: true,
    },
    {
        routeName: 'ProfileUpdate',
        component: ProfileUpdateScreen,
        hasProps: true,
    },
    {
        routeName: 'Notifications',
        component: NotificationScreen,
    },
    {
        routeName: 'Transactions',
        component: AllTransactionsScreen,
    },
    {
        routeName: 'SingleTransaction',
        component: SingleTransactionScreen,
    },
    {
        routeName: 'SendFunds',
        component: SendFundsScreen,
    },
    {
        routeName: 'RequestFunds',
        component: RequestFundsScreen,
    },
    {
        routeName: 'SelectAmountToSend',
        component: FundsConfigurationScreen,
    },
    {
        routeName: 'FundsConfirmation',
        component: FundsConfirmationScreen,
        hasOptions: true,
        options: {
            gestureEnabled: false,
        }
    },
]