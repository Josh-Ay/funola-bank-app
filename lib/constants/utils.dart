import 'package:flutter/material.dart';

const TextStyle kPoppinsFont = TextStyle(
  fontFamily: 'Poppins',
);

const String kAppPolicyLink = 'https://github.com/Josh-Ay/funola-bank-app';

// List of allowed user title options in the application
const List<Map<String, String>> kUserTitles = [
  {
    'title': 'Mr',
  },
  {
    'title': 'Mrs',
  },
  {
    'title': 'Miss',
  },
];

// List of allowed gender options in the application
const List<Map<String, String>> kUserGenderChoices = [
  {
    'gender': 'M',
  },
  {
    'gender': 'F',
  },
];

// List of allowed currencies in the application
const List<Map<String, String>> kValidFunolaCurrencies = [
  {
    'currency': 'USD',
  },
  {
    'currency': 'NGN',
  },
];

// List of allowed card payment networks in the application
const List<Map<String, String>> kValidFunolaCardPaymentNetworks = [
  {
    'network': 'Visa',
  },
  {
    'network': 'Mastercard',
  },
];

// List of allowed payment methods in the application
const List<Map<String, String>> kValidFunolaPaymentMethods = [
  {
    'method': 'card',
  },
  {
    'method': 'wallet',
  },
];

// List of valid bank account bank types in the application
const List<Map<String, String>> kValidFunolaBankAccountTypes = [
  {
    'type': 'Personal',
  },
  {
    'type': 'Savings',
  }
];

// Get the symbol of a currency
String kGetCurrencySymbol(String currency) {
  if (currency == 'NGN') return "₦";
  if (currency == 'USD') return "\$";

  return "";
}

// Convert a string to title case
String kConvertToTitleCase(String inputString) {
  return '${inputString[0].toUpperCase()}${inputString.substring(1).toLowerCase()}';
}
