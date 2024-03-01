import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';
import 'package:funola_bank_app/controllers/registration_controller.dart';
import 'package:funola_bank_app/screens/common/item_search_screen.dart';
import 'package:funola_bank_app/widgets/custom_input_widget.dart';
import 'package:get/get.dart';

class DropdownWithInputWidget extends StatelessWidget {
  final List dropdownItems;
  final String dropdownValue;
  final bool dropdownValueIsImageStr;
  final String inputLabel;
  final String inputTextValue;
  final bool inputIsReadOnly;
  final String? dropDownHintText;
  final Function? handleSelectItemFromDropdown;
  final Function? handleUpdateInputValue;
  final bool dropdownValueIsRequired;
  final int? maxInputLength;
  final bool isEmailInput;
  final bool isNumericInput;
  final bool isPhoneInput;
  final bool hasNextFocusableInput;

  final RegistrationController registrationController = Get.find();

  DropdownWithInputWidget({
    super.key,
    required this.dropdownItems,
    required this.dropdownValue,
    this.dropdownValueIsImageStr = false,
    required this.inputLabel,
    required this.inputTextValue,
    this.inputIsReadOnly = false,
    this.dropDownHintText,
    this.handleSelectItemFromDropdown,
    this.handleUpdateInputValue,
    this.dropdownValueIsRequired = false,
    this.maxInputLength,
    this.isEmailInput = false,
    this.isNumericInput = false,
    this.isPhoneInput = false,
    this.hasNextFocusableInput = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          inputLabel,
          style: kPoppinsFont.copyWith(
            fontSize: 14.0,
            fontWeight: FontWeight.w500,
            color: kGrey,
          ),
        ),
        const SizedBox(
          height: 8.0,
        ),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(
              10.0,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 14.0,
              vertical: 5.0,
            ),
            child: Row(
              children: [
                GestureDetector(
                  onTap: () async {
                    if (dropdownItems.isEmpty) return;

                    final selectedVal = await Get.to(
                      () => Obx(
                        () => ItemSearchScreen(
                          searchItems: dropdownItems,
                          searchValue:
                              registrationController.countrySearchValue.value,
                          searchHintText: dropDownHintText,
                          handleUpdateSearchValue: (val) {
                            registrationController.updateStringStateVal(
                              val,
                              kRCountrySearchValue,
                            );
                          },
                          itemsHaveKeyToExtract: true,
                          resultingItemKeyToExtractIsNested: true,
                          parentItemKey: 'name',
                          keyToExtractFromItems: 'common',
                        ),
                      ),
                    );

                    if (selectedVal == null ||
                        handleSelectItemFromDropdown == null) return;

                    handleSelectItemFromDropdown!(selectedVal);
                  },
                  child: Row(
                    children: [
                      dropdownValueIsImageStr
                          ? dropdownValue.isEmpty
                              ? const SizedBox.shrink()
                              : Image.network(
                                  dropdownValue,
                                  width: 18.0,
                                  height: 18.0,
                                  fit: BoxFit.cover,
                                )
                          : Text(
                              dropdownValue,
                              style: kPoppinsFont.copyWith(
                                fontSize: 14.0,
                              ),
                            ),
                      const Icon(
                        Icons.arrow_drop_down,
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  width: 10.0,
                ),
                Container(
                  width: 1.0,
                  color: kPaleGrey,
                  height: 30.0,
                ),
                const SizedBox(
                  width: 10.0,
                ),
                Expanded(
                  child: CustomInputWidget(
                    inputLabel: inputLabel,
                    inputIsReadOnly: inputIsReadOnly,
                    inputTextValue: inputTextValue,
                    handleUpdateInputValue: handleUpdateInputValue,
                    maxInputLength: maxInputLength,
                    isEmailInput: isEmailInput,
                    isNumericInput: isNumericInput,
                    isPhoneInput: isPhoneInput,
                    inputValueIsRequired: dropdownValueIsRequired,
                    hasNextInput: hasNextFocusableInput,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
