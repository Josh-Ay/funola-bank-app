import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export const RequestFundTabs = [
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