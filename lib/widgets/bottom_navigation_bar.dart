import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';
import 'package:funola_bank_app/screens/home_screen.dart';
import 'package:get/get.dart';
import 'package:icons_plus/icons_plus.dart';

class AppBottomNavigationBar extends StatelessWidget {
  final int? activePage;

  const AppBottomNavigationBar({
    super.key,
    this.activePage = 0,
  });

  List<Widget> generateAppNavigationTabs() {
    return [
      GestureDetector(
        onTap: () {
          Get.toNamed(HomeScreen.id);
        },
        child: Column(
          children: [
            Icon(
              AntDesign.home_outline,
              color: activePage == 0 ? kBlue : kGrey,
            ),
            const SizedBox(
              height: 8.0,
            ),
            Text(
              'Home',
              style: kPoppinsFont.copyWith(
                color: activePage == 0 ? kBlue : kGrey,
                fontSize: 13.0,
              ),
            ),
          ],
        ),
      ),
      GestureDetector(
        onTap: () {
          log('going to cards screen');
        },
        child: Column(
          children: [
            Icon(
              Bootstrap.wallet,
              color: activePage == 1 ? kBlue : kGrey,
            ),
            const SizedBox(
              height: 8.0,
            ),
            Text(
              'Cards',
              style: kPoppinsFont.copyWith(
                color: activePage == 1 ? kBlue : kGrey,
                fontSize: 13.0,
              ),
            ),
          ],
        ),
      ),
      GestureDetector(
        onTap: () {
          log('going to map screen');
        },
        child: Column(
          children: [
            Icon(
              Bootstrap.map,
              color: activePage == 2 ? kBlue : kGrey,
            ),
            const SizedBox(
              height: 8.0,
            ),
            Text(
              'Map',
              style: kPoppinsFont.copyWith(
                color: activePage == 2 ? kBlue : kGrey,
                fontSize: 13.0,
              ),
            ),
          ],
        ),
      ),
      GestureDetector(
        onTap: () {
          log('going to profile screen');
        },
        child: Column(
          children: [
            Icon(
              FontAwesome.user,
              color: activePage == 3 ? kBlue : kGrey,
            ),
            const SizedBox(
              height: 8.0,
            ),
            Text(
              'Profile',
              style: kPoppinsFont.copyWith(
                color: activePage == 3 ? kBlue : kGrey,
                fontSize: 13.0,
              ),
            ),
          ],
        ),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return BottomAppBar(
      height: 100.0,
      elevation: 0.0,
      color: kPaleBlue,
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: 10.0,
          vertical: 10.0,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: generateAppNavigationTabs(),
        ),
      ),
    );
  }
}
