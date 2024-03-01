import 'dart:developer';

import 'package:funola_bank_app/api/auth/services/auth_service.dart';
import 'package:funola_bank_app/api/models/response_model.dart';

class AuthRepository {
  final AuthService authService;

  AuthRepository({
    required this.authService,
  });

  Future sendVerificationCode(String phoneNumber, String email) async {
    ResponseModel response = await authService.sendVerificationCode(
      phoneNumber,
      email,
    );
  }

  Future<ResponseModel> loginExistingUser(String email, String password) async {
    ResponseModel response = await authService.loginUser(
      email,
      password,
    );

    return response;
  }
}
