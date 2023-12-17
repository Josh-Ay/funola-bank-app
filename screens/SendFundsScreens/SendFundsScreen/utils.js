import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export const SendFundTabs = [
    {
        title: 'Mobile',
        action: 'mobile',
        id: 12,
        icon: <Ionicons name="phone-portrait-outline" size={24} color="black" />
    },
    {
        title: 'Bank',
        action: 'bank',
        id: 22,
        icon: <Fontisto name="world-o" size={24} color="black" />
    },
    {
        title: 'Nearby',
        action: 'nearby',
        id: 32,
        icon: <Ionicons name="location-outline" size={24} color="black" />
    },
    {
        title: 'QR Code',
        action: 'qr',
        id: 42,
        icon: <MaterialIcons name="qr-code-scanner" size={24} color="black" />
    },
]