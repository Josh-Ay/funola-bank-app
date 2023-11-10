import { userItemActions } from "../../utils/utils";
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const cardItemActionsList = [
    {
        title: 'Fund',
        icon: <Ionicons name="ios-add" size={20} color="black" />,
        id: 19,
        action: userItemActions.cardFund,
    },
    {
        title: 'Send',
        icon: <Ionicons name="cash-outline" size={20} color="black" />,
        id: 49,
        action: userItemActions.cardSend,
    },
    {
        title: 'Request',
        icon: <Fontisto name="wallet" size={20} color="black" />,
        id: 59,
        action: userItemActions.cardRequest,
    },
    {
        title: 'History',
        icon: <MaterialCommunityIcons name="credit-card-clock-outline" size={20} color="black" />,
        id: 69,
        action: userItemActions.cardHistory,
    },
    {
        title: 'Change',
        icon: <Ionicons name="ios-swap-horizontal-sharp" size={20} color="black" />,
        id: 79,
        action: userItemActions.cardSwap,
    },
]