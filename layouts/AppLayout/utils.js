import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export const navigationItems = [
    {
        routeName: 'Home',
        displayName: 'Home',
        icon: (color) => <AntDesign name="home" size={24} color={color} />,
    },
    {
        routeName: 'Cards',
        displayName: 'Cards',
        icon: (color) => <Ionicons name="ios-wallet-outline" size={24} color={color} />,
    },
    {
        routeName: 'Map',
        displayName: 'Map',
        icon: (color) => <MaterialCommunityIcons name="map-search-outline" size={24} color={color} />,
    },
    {
        routeName: 'Profile',
        displayName: 'Profile',
        icon:  (color) => <FontAwesome name="user-o" size={24} color={color} />,
    },
]

export const miniSnapPoints = ['45%', '65%'];
export const fullSnapPoints = ['65%', '90%'];
export const mapSnapPoints = ['60%'];