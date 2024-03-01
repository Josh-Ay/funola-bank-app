import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/utils.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final Color backgroundColor;
  final FontWeight fontWeight;
  final Color textColor;
  final Function? handlePress;
  final double elevation;
  final Color splashColor;
  final Color highlightColor;
  final double focusElevation;
  final double highlightElevation;
  final double fontSize;
  final EdgeInsets padding;
  final TextDecoration textDecoration;

  const CustomButton({
    super.key,
    required this.text,
    this.backgroundColor = Colors.white,
    this.fontWeight = FontWeight.w500,
    this.textColor = Colors.black,
    this.elevation = 5.0,
    this.handlePress,
    this.splashColor = Colors.transparent,
    this.highlightColor = Colors.transparent,
    this.focusElevation = 1.0,
    this.highlightElevation = 1.0,
    this.fontSize = 14.0,
    this.padding = const EdgeInsets.all(20.0),
    this.textDecoration = TextDecoration.none,
  });

  @override
  Widget build(BuildContext context) {
    return MaterialButton(
      onPressed: () => handlePress!(),
      color: backgroundColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(
          10.0,
        ),
      ),
      elevation: elevation,
      focusElevation: focusElevation,
      highlightElevation: highlightElevation,
      splashColor: splashColor,
      highlightColor: highlightColor,
      child: Padding(
        padding: padding,
        child: Text(
          text,
          style: kPoppinsFont.copyWith(
            fontWeight: fontWeight,
            color: textColor,
            fontSize: fontSize,
            decoration: textDecoration,
          ),
        ),
      ),
    );
  }
}
