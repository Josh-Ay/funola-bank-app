import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';

class SectionTitleWithActionButton extends StatelessWidget {
  final String sectionTitle;
  final String buttonTitle;
  final Function? handleBtnPress;

  const SectionTitleWithActionButton({
    super.key,
    required this.sectionTitle,
    required this.buttonTitle,
    this.handleBtnPress,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          kConvertToTitleCase(sectionTitle),
          style: kPoppinsFont.copyWith(
            color: kDeepBlue,
            fontSize: 18.0,
          ),
        ),
        GestureDetector(
          onTap: () {
            if (handleBtnPress == null) return;
            handleBtnPress!();
          },
          child: Text(
            kConvertToTitleCase(buttonTitle),
            style: kPoppinsFont.copyWith(
              color: kBlue,
            ),
          ),
        ),
      ],
    );
  }
}
