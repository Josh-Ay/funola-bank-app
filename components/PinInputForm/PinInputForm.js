import React from "react"
import { Text } from "react-native"
import { TouchableOpacity, View } from "react-native"
import { pinFormStyles } from "./pinFormStyles"

export default PinInputForm = ({ 
    pin,
    updatePin,
    numberOfInputs,
}) => {

    const handleAddPinNumber = (number) => {
        if (isNaN(numberOfInputs)) return

        const currentPin = pin?.slice();
        if (currentPin?.length === Number(numberOfInputs)) return

        if (!updatePin || typeof updatePin !== 'function') return

        updatePin((prevValue) => {
            return `${prevValue}${number}`
        })
    }

    const handleDeletePinNumber = () => {
        const currentPin = pin?.slice();

        if (!updatePin || typeof updatePin !== 'function') return

        updatePin(currentPin?.slice(0, -1));
    }

    if (isNaN(numberOfInputs)) return <></>

    return <>
        <View style={pinFormStyles.pinDisplay}>
            {
                React.Children.toArray(
                    [...Array(Number(numberOfInputs)).fill(0).map((val, idx) => ({ number: `${idx}` }))].map((item, index) => {
                        return <View
                            style={
                                pin?.length - 1 >= index ? 
                                    pinFormStyles.filledPinDisplay 
                                :
                                pinFormStyles.unFilledPinDisplay
                            }
                        ></View>
                    })
                )       
            }
        </View>

        <View style={pinFormStyles.numberWrap}>
            {
                React.Children.toArray(
                    [...Array(9).fill(0).map((val, idx) => ({ number: `${idx + 1}` }))].map(item => {
                        return <TouchableOpacity 
                            style={pinFormStyles.numberBtn}
                            onPress={() => handleAddPinNumber(item.number)}
                        >
                            <Text style={pinFormStyles.numberBtnText}>{item.number}</Text>
                        </TouchableOpacity>
                    })
                )
            }
        </View>

        <View style={pinFormStyles.numberWrap}>
            <TouchableOpacity 
                style={pinFormStyles.blankNumberBtn}
                onPress={() => {}}
            >
                <Text style={pinFormStyles.numberBtnText}></Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={pinFormStyles.numberBtn}
                onPress={() => handleAddPinNumber(0)}
            >
                <Text style={pinFormStyles.numberBtnText}>0</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={pinFormStyles.numberBtn}
                onPress={() => handleDeletePinNumber()}
            >
                <Text style={pinFormStyles.numberBtnText}>{'<'}</Text>
            </TouchableOpacity>
        </View>
    </>
}