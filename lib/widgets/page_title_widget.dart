import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';
import 'package:get/get.dart';

class PageTitleInfo extends StatelessWidget {
  final String title;
  final Color titleTextColor;
  final String subtitle;
  final Color subtitleTextColor;
  final Function? handleTap;
  final Color backgroundColor;

  const PageTitleInfo({
    super.key,
    required this.title,
    required this.subtitle,
    this.titleTextColor = Colors.black,
    this.subtitleTextColor = kGrey,
    this.backgroundColor = Colors.transparent,
    this.handleTap,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            child: const Icon(Icons.arrow_back_ios),
            onTap: () {
              if (handleTap == null) {
                Get.back();
                return;
              }
              handleTap!();
            },
          ),
          const SizedBox(
            height: 20.0,
          ),
          Text(
            title,
            style: kPoppinsFont.copyWith(
              color: titleTextColor,
              fontSize: 28.0,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(
            height: 10.0,
          ),
          Text(
            subtitle,
            style: kPoppinsFont.copyWith(
              color: subtitleTextColor,
              fontWeight: FontWeight.w500,
              fontSize: 13.0,
            ),
          ),
          const SizedBox(
            height: 24.0,
          ),
        ],
      ),
    );
  }
}
