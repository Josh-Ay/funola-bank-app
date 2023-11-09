const { Router } = require("express");
const authController = require("../controllers/authController");
const { userAuth } = require("../middlewares/userAuth");


const router = Router();

router.post("/code", authController.send_verification_code);
router.post("/verify-code", authController.verify_code);
router.post("/register", authController.register_user);
router.get("/verify", authController.verify_new_account);
router.post("/login", authController.login_user);
router.post("/request-password-reset", authController.request_password_reset);
router.get("/reset-password", authController.reset_user_password);
router.put("/reset-password", authController.reset_user_password);
router.put("/change-password", userAuth, authController.change_user_password);
router.post("/refresh-token", authController.refresh_user_token);
router.get("/login-status", userAuth, authController.get_login_status);
router.delete("/delete-account", userAuth, authController.delete_account);
router.get("/logout", userAuth, authController.logout_user);

module.exports = router;
