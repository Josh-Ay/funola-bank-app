import { Image, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { dropdownStyles } from "./styles";
import { useEffect, useState } from "react";
import TextInputComponent from "../TextInputComponent/TextInputComponent";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../utils/colors";

const CustomDropdownItem = ({ 
    style, 
    content, 
    imageContent, 
    hasDropdownItems, 
    dropdownItems,
    extractKey, 
    resultingKeyIsNested,
    levelOfNesting,
    nestedKeyName,
    handleItemSelect,
    contentHasLoaded,
    placeholderText,
    dropdownIconStyle,
    customSearch,
    handleClearSearch,
}) => {

    const [ showDropdown, setShowDropdown ] = useState(false);
    const [ searchValue, setSearchValue ] = useState("");
    const [ copyOfItemsToDisplay, setCopyOfItemsToDisplay ] = useState([]);


    useEffect(() => {
        
        if (!Array.isArray(dropdownItems)) return

        setCopyOfItemsToDisplay(dropdownItems)
    
    }, [])

    useEffect(() => {

        if (!dropdownItems || !Array.isArray(dropdownItems)) return

        if (nestedKeyName) return setCopyOfItemsToDisplay(dropdownItems?.filter(item => item[extractKey][nestedKeyName]?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())));

        setCopyOfItemsToDisplay(dropdownItems?.filter(item => item[extractKey]?.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())));

    }, [searchValue])

    const handlePress = () => {
        if (!hasDropdownItems) return

        if (customSearch && content.length > 0) setSearchValue(content)

        setShowDropdown(true)
    }

    const SingleDropdownElement = ({ elemObj, keyToExtract, isNestedKey, levelOfNesting, nestedKeyName  }) => {
        
        const handleSingleItemClick = (selectedItem) => {
            setShowDropdown(false);
            setSearchValue("");
            handleItemSelect(selectedItem);
        }

        return <>
            <TouchableOpacity onPress={() => handleSingleItemClick(elemObj)}>
                <Text style={dropdownStyles.dropdownListItem}>
                    {
                        isNestedKey ? <>
                            {
                                !levelOfNesting || levelOfNesting === 1 ?
                                <>
                                    {elemObj[`${keyToExtract}`][`${nestedKeyName}`]} 
                                </> :
                                ''
                            }
                        </> : 
                        <>
                            {elemObj[`${keyToExtract}`]}
                        </>
                    }
                </Text>
            </TouchableOpacity>
        </>
    }

    if (!hasDropdownItems && (!dropdownItems || (dropdownItems && !Array.isArray(dropdownItems)))) return <>
        <TouchableWithoutFeedback
            style={Object.assign({}, style, dropdownStyles.customDropdown)} 
        >
            <View style={dropdownStyles.wrapper}>
                {
                    imageContent ? <Image source={{ uri: imageContent }} style={dropdownStyles.imageItem} /> : 
                    <Text> {content} </Text>
                }
                <AntDesign name="caretdown" size={12} color="black" />
            </View>
        </TouchableWithoutFeedback>
    </>

    return <>
        <TouchableOpacity 
            style={
                customSearch ?
                    Object.assign({}, dropdownStyles.customDropdown, style)
                :
                Object.assign({}, style, dropdownStyles.customDropdown)
            } 
            onPress={handlePress}
        >
            {
                imageContent ? <Image source={{ uri: imageContent }} style={dropdownStyles.imageItem} /> : 
                customSearch ?
                <>
                    <Ionicons name='search' size={16} />
                    <Text style={dropdownStyles.searchText}> {content.length < 1 ? placeholderText : content} </Text>
                </>
                :
                <Text> {content} </Text>
            }

            {
                customSearch ? 
                    <></>
                :
                <AntDesign name="caretdown" size={12} color="black" style={dropdownIconStyle ? dropdownIconStyle: {}} />
            }
        
            <Modal
                animationType={"slide"}
                // transparent={true}
                visible={showDropdown}
                onRequestClose={() => setShowDropdown(false)}
                style={dropdownStyles.modal}
            >
                <View 
                    style={dropdownStyles.dropdownItemsWrapper}
                >
                    <AntDesign 
                        name="close" 
                        size={18} 
                        color="black" 
                        style={dropdownStyles.modalCloseIcon} 
                        onPress={() => setShowDropdown(false)}
                    />
                    <View style={dropdownStyles.countrySearchWrapper}>
                        <View
                            style={dropdownStyles.searchIcon}                        
                        >
                            <AntDesign 
                                name="search1"
                                color="black" 
                                size={14}
                            />
                        </View>
                       
                        <TextInputComponent 
                            placeholder={placeholderText ? placeholderText : ''}
                            value={searchValue}
                            name={"countrySearchValue"}
                            handleInputChange={(name, val) => setSearchValue(val)}
                            disableFocusStyle={true}
                            style={dropdownStyles.searchInput}
                        />
                        
                        {
                            searchValue.length > 0 && <TouchableOpacity
                                style={dropdownStyles.clearSearchIcon}
                                onPress={
                                    () => {
                                        setSearchValue('')
                                        handleClearSearch && typeof handleClearSearch === 'function' && handleClearSearch()
                                    }
                                }
                            >
                                <Ionicons 
                                    name='close-circle' 
                                    size={16}
                                    color={colors.grey} 
                                />
                            </TouchableOpacity>
                        }
                    </View>
                    <View
                        style={dropdownStyles.dropdownListWrapper}
                    >
                        {
                            contentHasLoaded ?
                                searchValue.length > 1 && copyOfItemsToDisplay.length < 1 ?
                                    <Text>No items found matching {searchValue}</Text> 
                                :
                                    <FlashList
                                        data={copyOfItemsToDisplay}
                                        renderItem={
                                            ({ item }) => 
                                            <SingleDropdownElement 
                                                elemObj={item} 
                                                keyToExtract={extractKey}
                                                isNestedKey={resultingKeyIsNested}
                                                levelOfNesting={levelOfNesting}
                                                nestedKeyName={nestedKeyName} 
                                            />
                                        }
                                        estimatedItemSize={200}
                                    /> 
                            :
                            <Text>Please wait...</Text>
                        }                        
                    </View>
                </View>
            </Modal>
            
        </TouchableOpacity>    
    </>
}

export default CustomDropdownItem;
