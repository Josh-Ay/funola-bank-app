import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';

export const profileSettingItems = [
    {
        icon: <FontAwesome5 name="address-book" size={24} color="black" />,
        title: 'Change name',
        subtitle: 'Change your first and last name',
    },
    {
        icon: <MaterialCommunityIcons name="phone-dial-outline" size={24} color="black" />,
        title: 'Change phone',
        subtitle: 'Change your phone number',
    },
    {
        icon: <MaterialCommunityIcons name="email-check-outline" size={24} color="black" />,
        title: 'Change email',
        subtitle: 'Change your email',
    },
    {
        icon: <MaterialIcons name="language" size={24} color="black" />,
        title: 'Change language',
        subtitle: 'Change your language',
    },
]

export const securitySettingItems = [
    {
        icon: <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" />,
        title: 'Change password',
        subtitle: 'Change your password',
    },
    {
        icon: <Ionicons name="settings-outline" size={24} color="black" />,
        title: 'Change pin',
        subtitle: 'Change your pin',
    },
    {
        icon: <Ionicons name="trash-outline" size={24} color={colors.red} />,
        title: 'Delete Account',
        subtitle: 'Delete your account',
        type: 'danger'
    },
]
