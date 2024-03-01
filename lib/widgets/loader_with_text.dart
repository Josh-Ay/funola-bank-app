import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';

class LoaderWithText extends StatelessWidget {
  final Color? loaderColor;
  final String? loaderText;

  const LoaderWithText({
    super.key,
    this.loaderColor = kBlue,
    this.loaderText,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CircularProgressIndicator(
          color: loaderColor,
        ),
        const SizedBox(
          height: 15.0,
        ),
        Text(
          loaderText ?? 'Loading...',
          style: kPoppinsFont.copyWith(
            fontSize: 12.0,
          ),
        ),
      ],
    );
  }
}
