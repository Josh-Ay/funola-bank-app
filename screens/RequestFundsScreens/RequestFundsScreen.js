import { useEffect, useState } from "react";
import { RequestFundTabs } from "./utils";
import { useToast } from "react-native-toast-notifications";
import { requestFundStyles } from "./requestFundStyles";
import { ScrollView, View } from "react-native";
import { FlatList } from "react-native";
import UserActionItem from "../../components/UserActionItem/UserActionItem";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import { Ionicons } from '@expo/vector-icons';
import CustomButton from "../../components/CustomButton/CustomButton";
import { appLayoutStyles } from "../../layouts/AppLayout/styles";
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent";
import CustomDropdownItem from "../../components/DropdownItemComponent/CustomDropdownItem";
import { validFunolaCurrencies } from "../../utils/utils";
import { useUserContext } from "../../contexts/UserContext";
import QRCodeStyled from 'react-native-qrcode-styled';
import { SafeAreaView } from "react-native-safe-area-context";


const RequestFundsScreen = ({ navigation, route }) => {
    const [ activeTab, setActiveTab ] = useState(RequestFundTabs[0]?.action)
    const [ sheetModalIsOpen, setSheetModalIsOpen ] = useState(false);
    const [ codeGenerating, setCodeGenerating ] = useState(false);
    const [ codeGenerated, setCodeGenerated ] = useState(false);
    const [ codeStr, setCodeStr ] = useState('');
    const [ newRequestDetail, setNewRequestDetail ] = useState({
        amount: '',
        currency: ''
    });
    const [ passedItem, setPassedItem ] = useState(null);

    const { currentUser } = useUserContext();

    const toast = useToast();

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'info',
            placement: 'top'
        })
    }

    useEffect(() => {
        const { itemType, item } = route?.params;

        setPassedItem({
            itemType,
            item,
        })
    }, [])

    const handleUpdateNewRequestDetail = (keyToUpdate, newValue) => {
        setNewRequestDetail((prevDetail) => {
            return {
                ...prevDetail,
                [keyToUpdate]: newValue
            }
        })
    }

    const handleGenerateBtnClick = () => {
        if (codeGenerated) {
            setNewRequestDetail({
                amount: '',
                currency: ''
            });
            setCodeGenerated(false);
            setCodeStr('');

            return
        }
        if (
            newRequestDetail.amount.length < 1 || 
            newRequestDetail.currency.length < 1 || 
            isNaN(newRequestDetail.amount)
        ) return

        const amountToSendAsNum = Number(newRequestDetail.amount);

        if (amountToSendAsNum < 0.01) return
        
        const data = {
            ...newRequestDetail,
            amount: amountToSendAsNum,
            receiverDetail: currentUser,
            receivingItemType: passedItem?.itemType,
        }

        setCodeGenerating(true);
        setCodeStr(JSON.stringify(data));

        setTimeout(() => {
            setCodeGenerating(false);
            setCodeGenerated(true);
        }, 300)
    }

    return <>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paleBlue }}>
            <View style={requestFundStyles.topContentWrapper}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={requestFundStyles.topContent}>
                    <Text style={requestFundStyles.titleText}>Request funding</Text>
                    <Text style={requestFundStyles.subtitleText}>Select options</Text>
                    <SafeAreaView style={requestFundStyles.cardActionsStyle}>
                        <FlatList
                            data={RequestFundTabs}
                            renderItem={
                                ({item}) => 
                                <UserActionItem
                                    item={item} 
                                    handleItemPress={(item) => setActiveTab(item)} 
                                    style={activeTab !== item.action ? requestFundStyles.nonActiveTab : {}} 
                                />
                            }
                            keyExtractor={item => item.id}
                            horizontal={true}
                            contentContainerStyle={{
                                alignItems: 'center',
                                gap: 30,
                                width: '100%',
                                paddingLeft: 8,
                                paddingRight: 8,
                            }}
                        />
                    </SafeAreaView>
                </View>
            </View>
            <ScrollView style={requestFundStyles.contentWrapper}>
                {
                    activeTab === 'nearby' ? <>
                        <Text style={requestFundStyles.comingSoonText}>Feature coming soon</Text>
                    </> :
                    
                    activeTab === 'qr' ? <>
                        <View style={requestFundStyles.qrWrapper}>
                            <Text style={requestFundStyles.itemContentTitle}>
                                {
                                    codeGenerated ? 'Payment Code' :
                                    'Generate Payment Code'
                                }
                            </Text>
                            
                            {
                                codeGenerated ? <>
                                    <Text style={requestFundStyles.contentText}>Use the code below to process funding request</Text>

                                    <QRCodeStyled
                                        data={codeStr}
                                        style={requestFundStyles.qrCodeImage}
                                        padding={20}
                                        pieceSize={3}
                                        color={colors.deepBlue}
                                    />
                                </> :
                                <>
                                    <View>
                                        <Text style={requestFundStyles.headingText}>Amount</Text>
                                        <TextInputComponent 
                                            value={newRequestDetail.amount}
                                            style={requestFundStyles.amountText}
                                            handleInputChange={(name, val) => handleUpdateNewRequestDetail(name, val)}
                                            isNumericInput={true}
                                            returnKeyType={'done'}
                                            disableFocusStyle={true}
                                            name={'amount'}
                                            placeholder={'10'}
                                        />
                                    </View>
        
                                    
                                    <View style={appLayoutStyles.modalInputItemWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Currency</Text>
                                        <CustomDropdownItem
                                            hasDropdownItems={true}
                                            dropdownItems={validFunolaCurrencies}
                                            extractKey={'currency'}
                                            content={newRequestDetail.currency}
                                            handleItemSelect={(selectedVal) => handleUpdateNewRequestDetail('currency', selectedVal.currency)}
                                            contentHasLoaded={true}
                                            style={appLayoutStyles.modalSelectItem}
                                            placeholderText={'Select currency'}
                                            dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                        />
                                    </View>
                                </>
                            }

                            <CustomButton
                                buttonText={
                                    codeGenerating ? 'Please wait...'
                                    :
                                    codeGenerated ? 'Reset'
                                    :
                                    'Generate'
                                }
                                btnStyle={
                                    codeGenerating ?
                                        Object.assign({}, appLayoutStyles.modalBtnStyle, appLayoutStyles.disabledModalBtn)
                                    :
                                    appLayoutStyles.modalBtnStyle
                                }
                                textContentStyle={
                                    appLayoutStyles.modalBtnTextStyle
                                }
                                handleBtnPress={handleGenerateBtnClick}
                                disabled={codeGenerating ? true : false}
                            />
                        </View>
                    </> :
                    
                    <></>
                }
            </ScrollView>
        </SafeAreaView>
    </>
}

export default RequestFundsScreen;