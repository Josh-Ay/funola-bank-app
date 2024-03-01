import 'dart:developer' show log;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';

class CustomInputWidget extends StatelessWidget {
  final String? inputLabel;
  final bool inputIsReadOnly;
  final String inputTextValue;
  final Function? handleUpdateInputValue;
  final int? maxInputLength;
  final bool isEmailInput;
  final bool isNumericInput;
  final bool isPhoneInput;
  final bool isSecureInput;
  final bool inputValueIsRequired;
  final bool showLabelText;
  final bool hasNextInput;

  final TextEditingController textInputController = TextEditingController();

  CustomInputWidget({
    super.key,
    this.inputLabel,
    this.inputIsReadOnly = false,
    this.inputTextValue = '',
    this.handleUpdateInputValue,
    this.maxInputLength,
    this.isEmailInput = false,
    this.isNumericInput = false,
    this.isPhoneInput = false,
    this.isSecureInput = false,
    this.inputValueIsRequired = false,
    this.showLabelText = false,
    this.hasNextInput = false,
  });

  @override
  Widget build(BuildContext context) {
    textInputController.text = inputTextValue;
    textInputController.selection = TextSelection.fromPosition(
      TextPosition(
        offset: textInputController.text.length,
      ),
    );

    if (showLabelText == true) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            inputLabel ?? 'Label',
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
              child: _TextFormFieldWidget(
                inputIsReadOnly: inputIsReadOnly,
                textInputController: textInputController,
                inputValueIsRequired: inputValueIsRequired,
                inputLabel: inputLabel,
                maxInputLength: maxInputLength,
                isEmailInput: isEmailInput,
                isNumericInput: isNumericInput,
                isPhoneInput: isPhoneInput,
                isSecureInput: isSecureInput,
                handleUpdateInputValue: handleUpdateInputValue,
                hasNextInput: hasNextInput,
              ),
            ),
          )
        ],
      );
    }

    return _TextFormFieldWidget(
      inputIsReadOnly: inputIsReadOnly,
      textInputController: textInputController,
      inputValueIsRequired: inputValueIsRequired,
      inputLabel: inputLabel,
      maxInputLength: maxInputLength,
      isEmailInput: isEmailInput,
      isNumericInput: isNumericInput,
      isPhoneInput: isPhoneInput,
      isSecureInput: isSecureInput,
      handleUpdateInputValue: handleUpdateInputValue,
      hasNextInput: hasNextInput,
    );
  }
}

class _TextFormFieldWidget extends StatefulWidget {
  const _TextFormFieldWidget({
    super.key,
    required this.inputIsReadOnly,
    required this.textInputController,
    required this.inputValueIsRequired,
    required this.inputLabel,
    required this.maxInputLength,
    required this.isEmailInput,
    required this.isNumericInput,
    required this.isPhoneInput,
    required this.isSecureInput,
    required this.handleUpdateInputValue,
    required this.hasNextInput,
  });

  final bool inputIsReadOnly;
  final TextEditingController textInputController;
  final bool inputValueIsRequired;
  final String? inputLabel;
  final int? maxInputLength;
  final bool isEmailInput;
  final bool isNumericInput;
  final bool isPhoneInput;
  final bool isSecureInput;
  final Function? handleUpdateInputValue;
  final bool hasNextInput;

  @override
  State<_TextFormFieldWidget> createState() => _TextFormFieldWidgetState();
}

class _TextFormFieldWidgetState extends State<_TextFormFieldWidget> {
  bool textIsObscured = false;

  @override
  void initState() {
    if (widget.isSecureInput == true) {
      setState(() {
        textIsObscured = true;
      });
    }

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Focus(
          onFocusChange: (bool hasFocus) {
            if (hasFocus == false) {
              if (widget.handleUpdateInputValue == null) return;

              widget.handleUpdateInputValue!(widget.textInputController.text);
            }
          },
          child: TextFormField(
            style: kPoppinsFont.copyWith(
              fontSize: 14.0,
            ),
            autovalidateMode: AutovalidateMode.onUserInteraction,
            decoration: const InputDecoration(
              border: InputBorder.none,
              counterText: '',
            ),
            readOnly: widget.inputIsReadOnly,
            controller: widget.textInputController,
            validator: (value) {
              if (widget.inputValueIsRequired == true &&
                  (value == null || value.isEmpty)) {
                return 'Please ${widget.inputLabel != null ? widget.inputLabel!.toLowerCase() : "enter value for input"}';
              }
              return null;
            },
            obscureText: textIsObscured,
            maxLength: widget.maxInputLength,
            textInputAction: widget.hasNextInput == true
                ? TextInputAction.next
                : TextInputAction.done,
            keyboardType: widget.isEmailInput == true
                ? TextInputType.emailAddress
                : widget.isNumericInput == true
                    ? TextInputType.number
                    : widget.isPhoneInput
                        ? TextInputType.phone
                        : TextInputType.text,
            inputFormatters: widget.isNumericInput
                ? [
                    FilteringTextInputFormatter.allow(RegExp("[0-9]")),
                  ]
                : [],
            onFieldSubmitted: (String submittedValue) {
              if (widget.handleUpdateInputValue == null) return;

              widget.handleUpdateInputValue!(submittedValue);
            },
            onSaved: (String? savedValue) {
              if (widget.handleUpdateInputValue == null) return;

              widget.handleUpdateInputValue!(savedValue);
            },
          ),
        ),
        Positioned(
          right: 0.0,
          child: SizedBox(
            width: 50.0,
            height: 50.0,
            child: widget.isSecureInput
                ? GestureDetector(
                    child: const Icon(
                      Icons.remove_red_eye_outlined,
                      size: 22.0,
                    ),
                    onTap: () {
                      setState(() {
                        textIsObscured = !textIsObscured;
                      });
                    },
                  )
                : const SizedBox.shrink(),
          ),
        ),
      ],
    );
  }
}
