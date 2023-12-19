import { Image, Text, TouchableOpacity, View } from "react-native";
import { sendFundStyles } from "../../sendFundStyles";
import React from "react";
import { useUserContext } from "../../../../../contexts/UserContext";
import { AntDesign } from '@expo/vector-icons';

export default ContactItem = ({ item, showOnlyContactsOnFunola }) => {
    const {
        otherUsers,
    } = useUserContext();

    const handleSelectContact = (numberPassed) => {
        const foundUserOnFunola = otherUsers?.find(user => user?.phoneNumber === numberPassed?.slice(-10));

        if (foundUserOnFunola) {
            console.log(foundUserOnFunola);
            // navigator.navigate(
            //     '', 
            //     {}
            // )
            return
        }

        console.log('invite user to funola');
    }

    if (Array.isArray(item?.phoneNumbers)) return <>
        {
            React.Children.toArray(item?.phoneNumbers.map(number => {
                const numberIsOnFunola = otherUsers?.find(user => user?.phoneNumber === number?.digits?.slice(-10));

                if (showOnlyContactsOnFunola && !numberIsOnFunola) return <></>

                return <>
                    <View style={sendFundStyles.singleContact}>
                        <View style={sendFundStyles.singleContactTopContent}>
                            {
                                item.imageAvailable ? 
                                <Image
                                    source={item.image}
                                    style={sendFundStyles.contactImage}
                                />
                                :
                                <AntDesign name="user" size={35} color="black" />
                            }
                            
                            <View>
                                <Text style={sendFundStyles.contactName}>{item?.name?.length > 25 ? item?.name?.slice(0, 25) + '...' : item?.name}</Text>
                                <Text style={sendFundStyles.contactNumber}>{number?.digits}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={sendFundStyles.contactActionBtn}
                            onPress={() => handleSelectContact(number?.digits)}
                        >
                            <Text style={sendFundStyles.contactActionBtnText}>
                                {
                                    numberIsOnFunola ? 
                                        'Select'
                                    :
                                    'Invite'
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            }))
        }
    </>
    
    return <></>
}