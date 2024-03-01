import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';

class AppSearchBar extends StatelessWidget {
  final String searchValue;
  final Color backgroundColor;
  final String hintText;
  final Function? updateSearchValue;

  const AppSearchBar({
    super.key,
    required this.hintText,
    required this.searchValue,
    this.backgroundColor = kPaleGrey,
    this.updateSearchValue,
  });

  @override
  Widget build(BuildContext context) {
    final TextEditingController textFieldController = TextEditingController();
    textFieldController.text = searchValue;

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8.0),
        color: backgroundColor,
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          vertical: 3.0,
          horizontal: 12.0,
        ),
        child: Row(
          children: [
            const Icon(
              Icons.search,
              color: Colors.grey,
            ),
            const SizedBox(
              width: 15.0,
            ),
            Expanded(
              child: TextField(
                onChanged: (val) {
                  if (updateSearchValue == null) return;
                  updateSearchValue!(val.toLowerCase());
                },
                // controller: textFieldController,
                style: kPoppinsFont.copyWith(
                  color: Colors.black,
                  fontSize: 14.0,
                ),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: hintText,
                  hintStyle: kPoppinsFont.copyWith(
                    color: Colors.grey,
                    fontSize: 14.0,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
