import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';

export const userProfileActions = {
    nameChange: 'name',
    phoneChange: 'phone',
    emailChange: 'email',
    languageChange: 'language',
    passwordChange: 'password',
    loginPinChange: 'login-pin',
    transactionPinChange: 'transaction-pin',
    deleteAccount: 'delete-account',
    viewBanks: 'view-banks',
    selfHelp: 'self-help',
    contactUs: 'contact-us',
}

export const profileSettingItems = [
    {
        icon: <FontAwesome5 name="address-book" size={24} color="black" />,
        title: 'Change name',
        subtitle: 'Change your first and last name',
        action: userProfileActions.nameChange,
    },
    {
        icon: <MaterialCommunityIcons name="phone-dial-outline" size={24} color="black" />,
        title: 'Change phone',
        subtitle: 'Change your phone number',
        action: userProfileActions.phoneChange,
    },
    {
        icon: <MaterialCommunityIcons name="email-check-outline" size={24} color="black" />,
        title: 'Change email',
        subtitle: 'Change your email',
        action: userProfileActions.emailChange,
    },
    // {
    //     icon: <MaterialIcons name="language" size={24} color="black" />,
    //     title: 'Change language',
    //     subtitle: 'Change your language',
    //     action: userProfileActions.languageChange,
    // },
]

export const securitySettingItems = [
    {
        icon: <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" />,
        title: 'Change password',
        subtitle: 'Change your password',
        action: userProfileActions.passwordChange,
    },
    // {
    //     icon: <Ionicons name="settings-outline" size={24} color="black" />,
    //     title: 'Change login pin',
    //     subtitle: 'Change your login pin',
    //     action: userProfileActions.loginPinChange,
    // },
    {
        icon: <MaterialCommunityIcons name="cog-transfer-outline" size={24} color="black" />,
        title: 'Change transaction pin',
        subtitle: 'Change your transaction pin',
        action: userProfileActions.transactionPinChange,
    },
    // {
    //     icon: <Ionicons name="trash-outline" size={24} color={colors.red} />,
    //     title: 'Delete Account',
    //     subtitle: 'Delete your account',
    //     type: 'danger',
    //     action: userProfileActions.deleteAccount,
    // },
]

export const bankSettingItems = [
    {
        icon: <MaterialCommunityIcons name="bank-outline" size={24} color={colors.black} />,
        title: 'View your saved banks',
        subtitle: 'View or update your saved banks',
        action: userProfileActions.viewBanks,
    },
]

export const helpSettingItems = [
    {
        icon: <Ionicons name="information-circle-outline" size={24} color="black" />,
        title: 'Self help',
        subtitle: "Troubleshoot common issues",
        action: userProfileActions.selfHelp,
    },
    {
        icon: <Ionicons name="ios-mail-unread-outline" size={24} color="black" />,
        title: 'Contact us',
        subtitle: "Come say hello! We'd love to hear from you",
        action: userProfileActions.contactUs,
    },
]