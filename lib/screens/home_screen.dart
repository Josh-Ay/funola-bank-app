import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';
import 'package:funola_bank_app/widgets/bottom_navigation_bar.dart';
import 'package:funola_bank_app/widgets/section_title_with_action_button.dart';
import 'package:icons_plus/icons_plus.dart';

class HomeScreen extends StatelessWidget {
  static String id = 'home_screen';

  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kPaleBlue,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Stack(
            children: [
              Container(
                color: kDeepBlue,
                height: 480.0,
                child: Padding(
                  padding: const EdgeInsets.only(
                    top: 30.0,
                    left: 20.0,
                    right: 20.0,
                    bottom: 30.0,
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          GestureDetector(
                            onTap: () {
                              log('swapping wallets...');
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(
                                  30.0,
                                ),
                                color: kPaleBlue,
                              ),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20.0,
                                  vertical: 12.0,
                                ),
                                child: Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Image.asset(
                                      'assets/currenciesFlag/USD.jpg',
                                      width: 20.0,
                                      height: 20.0,
                                    ),
                                    const SizedBox(
                                      width: 10.0,
                                    ),
                                    Text(
                                      'USD',
                                      style: kPoppinsFont,
                                    ),
                                    const SizedBox(
                                      width: 5.0,
                                    ),
                                    const Icon(
                                      Icons.swap_vert_sharp,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          Row(
                            children: [
                              GestureDetector(
                                onTap: () {
                                  log('going to notifications');
                                },
                                child: Transform.rotate(
                                    angle: 7,
                                    child: Stack(
                                      children: [
                                        const Icon(
                                          Bootstrap.bell_fill,
                                          color: kPaleBlue,
                                          size: 20.0,
                                        ),
                                        Positioned(
                                          right: 0.0,
                                          top: 0.0,
                                          child: Container(
                                            width: 11.0,
                                            height: 11.0,
                                            decoration: BoxDecoration(
                                              color: kPaleBlue,
                                              borderRadius:
                                                  BorderRadius.circular(
                                                11.0,
                                              ),
                                              border: Border.all(
                                                color: kDeepBlue,
                                                width: 2.0,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    )),
                              ),
                              const SizedBox(
                                width: 18.0,
                              ),
                              GestureDetector(
                                onTap: () {
                                  log('Going to profile screen');
                                },
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(
                                    4.0,
                                  ),
                                  child: Image.asset(
                                    'assets/images/man.jpg',
                                    width: 30.0,
                                    height: 30.0,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(
                        height: 22.0,
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.max,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.start,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '${kGetCurrencySymbol('USD')} 409',
                                    style: kPoppinsFont.copyWith(
                                      fontSize: 34.0,
                                      color: kPaleBlue,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(
                                    width: 40.0,
                                  ),
                                  GestureDetector(
                                    onTap: () {
                                      log('hiding balance');
                                    },
                                    child: const Icon(
                                      Bootstrap.eye_slash,
                                      color: kPaleBlue,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                'Available Balance',
                                style: kPoppinsFont.copyWith(
                                  fontSize: 12.0,
                                  color: kPaleBlue,
                                ),
                              ),
                              Container(
                                width: 300.0,
                                height: 100.0,
                                child: ListView(
                                  scrollDirection: Axis.horizontal,
                                  children: [
                                    Column(
                                      children: [
                                        Container(
                                          decoration: BoxDecoration(
                                            borderRadius: BorderRadius.circular(
                                              6.0,
                                            ),
                                            color: kPaleBlue,
                                          ),
                                          child: Icon(Icons.add),
                                        ),
                                        Text(
                                          'Fund',
                                          style: kPoppinsFont.copyWith(
                                            color: Colors.white,
                                          ),
                                        )
                                      ],
                                    )
                                  ],
                                ),
                              )
                            ],
                          ),
                        ],
                      )
                    ],
                  ),
                ),
              ),
              Positioned(
                bottom: 0.0,
                left: 0.0,
                right: 0.0,
                child: Container(
                  decoration: const BoxDecoration(
                    color: kPaleBlue,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(
                        25.0,
                      ),
                      topRight: Radius.circular(
                        25.0,
                      ),
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20.0,
                      vertical: 30.0,
                    ),
                    child: Column(
                      children: [
                        SectionTitleWithActionButton(
                          sectionTitle: 'your cards',
                          buttonTitle: 'add',
                          handleBtnPress: () {
                            log('adding new card');
                          },
                        ),
                        const SizedBox(
                          height: 20.0,
                        ),
                        SectionTitleWithActionButton(
                          sectionTitle: 'deposits',
                          buttonTitle: 'add',
                          handleBtnPress: () {
                            log('adding new deposit');
                          },
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const AppBottomNavigationBar(
        activePage: 0,
      ),
    );
  }
}
