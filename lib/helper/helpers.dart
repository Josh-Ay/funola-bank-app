import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:funola_bank_app/constants/colors.dart';

bool validateEmailAddress(String emailToCheck) {
  return RegExp(
    r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+",
  ).hasMatch(emailToCheck);
}

void showToastMessage({
  required String message,
  Toast? toastLength,
  ToastGravity? toastGravity,
  Color? backgroundColor,
  Color? textColor,
  int? toastDuration,
}) {
  Fluttertoast.showToast(
    msg: message,
    toastLength: toastLength ?? Toast.LENGTH_SHORT,
    gravity: toastGravity ?? ToastGravity.CENTER,
    timeInSecForIosWeb: toastDuration ?? 1,
    backgroundColor: backgroundColor ?? kGrey,
    textColor: textColor ?? Colors.white,
    fontSize: 16.0,
  );
}
