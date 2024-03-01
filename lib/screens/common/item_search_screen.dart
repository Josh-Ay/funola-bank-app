import 'dart:convert';
import 'dart:developer' show log;
import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/utils.dart';
import 'package:funola_bank_app/controllers/registration_controller.dart';
import 'package:funola_bank_app/widgets/app_search_bar.dart';
import 'package:get/get.dart';

class ItemSearchScreen extends StatelessWidget {
  final String searchValue;
  final String? searchHintText;
  final Function? handleUpdateSearchValue;
  final Function? handleItemSelect;
  final List searchItems;
  final bool itemsHaveKeyToExtract;
  final bool resultingItemKeyToExtractIsNested;
  final String? parentItemKey;
  final String? keyToExtractFromItems;

  const ItemSearchScreen({
    super.key,
    this.searchValue = '',
    this.searchHintText,
    this.handleUpdateSearchValue,
    this.handleItemSelect,
    required this.searchItems,
    this.itemsHaveKeyToExtract = false,
    this.resultingItemKeyToExtractIsNested = false,
    this.parentItemKey,
    this.keyToExtractFromItems,
  });

  @override
  Widget build(BuildContext context) {
    RegistrationController registrationController = Get.find();

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            vertical: 10.0,
            horizontal: 15.0,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              GestureDetector(
                onTap: () {
                  registrationController.updateStringStateVal(
                    '',
                    kRCountrySearchValue,
                  );
                  Get.back(result: null);
                },
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Icon(Icons.close),
                  ],
                ),
              ),
              const SizedBox(
                height: 20.0,
              ),
              AppSearchBar(
                searchValue: searchValue,
                hintText: searchHintText ?? 'Search',
                updateSearchValue: (searchVal) {
                  if (handleUpdateSearchValue == null) return;

                  handleUpdateSearchValue!(
                    searchVal,
                  );
                },
              ),
              const SizedBox(
                height: 20.0,
              ),
              Expanded(
                child: _DropdownListing(
                  itemsToDisplay: searchItems,
                  itemToFilterBy: searchValue,
                  itemsHaveKeyToExtract: itemsHaveKeyToExtract,
                  keyToExtractFromItems: itemsHaveKeyToExtract == true &&
                          keyToExtractFromItems != null
                      ? keyToExtractFromItems
                      : '',
                  parentKey: parentItemKey,
                  keyToExtractIsNested: resultingItemKeyToExtractIsNested,
                  handleSelectItemInListing: (var selectedItem) {
                    registrationController.updateStringStateVal(
                      '',
                      kRCountrySearchValue,
                    );

                    Get.back(result: selectedItem);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DropdownListing extends StatelessWidget {
  final List itemsToDisplay;
  final String itemToFilterBy;
  final bool keyToExtractIsNested;
  final String? parentKey;
  final String? keyToExtractFromItems;
  final bool? itemsHaveKeyToExtract;
  final Function? handleSelectItemInListing;

  const _DropdownListing({
    this.keyToExtractFromItems = '',
    required this.itemsToDisplay,
    required this.itemToFilterBy,
    this.keyToExtractIsNested = false,
    this.parentKey = '',
    this.itemsHaveKeyToExtract = false,
    this.handleSelectItemInListing,
  });

  void handleSelectListingItem(var item) {
    if (handleSelectItemInListing == null) return;

    handleSelectItemInListing!(item);
  }

  @override
  Widget build(BuildContext context) {
    List updatedListing = itemToFilterBy.isNotEmpty
        ? itemsToDisplay.where((element) {
            try {
              Map<String, dynamic> itemInJson =
                  json.decode(json.encode(element));

              if (keyToExtractIsNested && parentKey!.isNotEmpty) {
                String itemName =
                    itemInJson[parentKey][keyToExtractFromItems].toString();

                if (itemName.toLowerCase().contains(itemToFilterBy)) {
                  return true;
                }
                return false;
              }

              String itemName = itemInJson[keyToExtractFromItems].toString();

              if (itemName.toLowerCase().contains(itemToFilterBy)) return true;
              return false;
            } catch (error) {
              log('$error');
              return false;
            }
          }).toList()
        : itemsToDisplay;

    return ListView.builder(
      shrinkWrap: true,
      itemCount: updatedListing.length,
      itemBuilder: ((context, index) {
        if (itemsHaveKeyToExtract == false) {
          return _DropdownItem(
            item: updatedListing[index],
            itemText: updatedListing[index],
            handleSelectItem: handleSelectListingItem,
          );
        }

        try {
          Map<String, dynamic> itemInJson =
              json.decode(json.encode(updatedListing[index]));

          if (keyToExtractIsNested && parentKey!.isNotEmpty) {
            return _DropdownItem(
              item: itemInJson,
              itemText: itemInJson[parentKey][keyToExtractFromItems],
              handleSelectItem: handleSelectListingItem,
            );
          }

          return _DropdownItem(
            item: itemInJson,
            itemText: itemInJson[keyToExtractFromItems],
            handleSelectItem: handleSelectListingItem,
          );
        } catch (e) {
          log('Error parsing dropdown item : $e');
          return const _DropdownItem(
            item: {},
            itemText: '',
          );
        }
      }),
    );
  }
}

class _DropdownItem extends StatelessWidget {
  final Map<String, dynamic> item;
  final String itemText;
  final Function? handleSelectItem;

  const _DropdownItem({
    super.key,
    required this.item,
    required this.itemText,
    this.handleSelectItem,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        GestureDetector(
          onTap: () {
            log('Dropdown item clicked: $item');
            if (handleSelectItem == null) return;

            handleSelectItem!(item);
          },
          child: Text(
            itemText,
            style: kPoppinsFont,
          ),
        ),
        const SizedBox(
          height: 20.0,
        ),
      ],
    );
  }
}
