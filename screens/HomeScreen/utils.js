import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { userItemActions } from '../../utils/utils';

export const walletItemActionsList = [
    {
        title: 'Fund',
        icon: <Ionicons name="add" size={20} color="black" />,
        id: 39,
        action: userItemActions.walletFund
    },
    {
        title: 'Send',
        icon: <Ionicons name="cash-outline" size={20} color="black" />,
        id: 49,
        action: userItemActions.walletSend,
    },
    {
        title: 'Request',
        icon: <Fontisto name="wallet" size={20} color="black" />,
        id: 59,
        action: userItemActions.walletRequest,
    },
    {
        title: 'History',
        icon: <MaterialCommunityIcons name="credit-card-clock-outline" size={20} color="black" />,
        id: 69,
        action: userItemActions.walletHistory,
    },
    {
        title: 'Change',
        icon: <Ionicons name="swap-horizontal-sharp" size={20} color="black" />,
        id: 79,
        action: userItemActions.walletSwap,
    },
]