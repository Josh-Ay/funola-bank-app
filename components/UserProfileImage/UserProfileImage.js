import { TouchableOpacity } from 'react-native'
import { Image } from 'react-native'
import { View } from 'react-native'

export default UserProfileImage = ({ 
    user, 
    wrapperStyle, 
    imageStyle, 
    pressable, 
    handlePress, 
}) => {

    if (!user) return <></>

    if (pressable) return <>
        <TouchableOpacity 
            style={
                typeof wrapperStyle === 'object' ?
                    wrapperStyle 
                :
                {}
            }
            onPress={
                handlePress && typeof handlePress === 'function' ?
                    () => handlePress()
                : 
                () => {}  
            }
        >
            {
                user?.gender === 'M' ?
                    <Image 
                        style={
                            typeof imageStyle === 'object' ?
                                imageStyle
                            :
                            {}
                        } 
                        source={require('../../assets/man.jpg')} 
                    />
                :
                user?.gender === 'F' ?
                    <Image 
                        style={
                            typeof imageStyle === 'object' ?
                                imageStyle
                            :
                            {}
                        } 
                        source={require('../../assets/woman.jpg')} 
                    />
                :
                <></>
            }
        </TouchableOpacity>
    </>
    
    return <>
        <View 
            style={
                typeof wrapperStyle === 'object' ?
                    wrapperStyle 
                :
                {}
            }
        >
            {
                user?.gender === 'M' ?
                    <Image 
                        style={
                            typeof imageStyle === 'object' ?
                                imageStyle
                            :
                            {}
                        } 
                        source={require('../../assets/man.jpg')} 
                    />
                :
                user?.gender === 'F' ?
                    <Image 
                        style={
                            typeof imageStyle === 'object' ?
                                imageStyle
                            :
                            {}
                        } 
                        source={require('../../assets/woman.jpg')} 
                    />
                :
                <></>
            }
        </View>
    </>
}