import { Image, Text, TouchableOpacity, View } from "react-native";
import { sendFundStyles } from "../../sendFundStyles";
import React from "react";
import { useUserContext } from "../../../../../contexts/UserContext";
import { AntDesign } from '@expo/vector-icons';

export default ContactItem = ({ 
    item, 
    showOnlyContactsOnFunola, 
    handleSelectContact, 
    hideContactActionBtn,
    genderSelectionAvailable,
    style
}) => {
    const {
        otherUsers,
    } = useUserContext();

    if (Array.isArray(item?.phoneNumbers)) return <>
        {
            React.Children.toArray(item?.phoneNumbers.map(number => {
                const numberIsOnFunola = otherUsers?.find(user => user?.phoneNumber === number?.digits?.slice(-10));

                if (showOnlyContactsOnFunola && !numberIsOnFunola) return <></>

                return <>
                    <View style={
                        style && typeof style === 'object' ?
                            Object.assign(
                                {},
                                sendFundStyles.singleContact,
                                style
                            )
                            :
                            sendFundStyles.singleContact
                        }
                    >
                        <View style={sendFundStyles.singleContactTopContent}>
                            {
                                genderSelectionAvailable && item?.gender ?
                                <UserProfileImage 
                                    user={{ gender: item?.gender }}
                                    pressable={false}
                                    imageStyle={sendFundStyles.contactImageWrapper}
                                /> :
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
                        {
                            hideContactActionBtn ? <></> 
                            :
                            <TouchableOpacity
                                style={sendFundStyles.contactActionBtn}
                                onPress={
                                    handleSelectContact && typeof handleSelectContact === 'function' ?
                                        () => handleSelectContact(number?.digits)
                                    :
                                    () => {}
                                    }
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
                        }
                    </View>
                </>
            }))
        }
    </>
    
    return <></>
}