const { Router } = require("express");
const userController = require("../controllers/userController");
const { userAuth } = require("../middlewares/userAuth");

const router = Router();

router.get("/profile", userAuth, userController.get_user_profile);
router.patch("/update-profile/:updateType", userAuth, userController.update_user_detail);
router.get("/notifications", userAuth, userController.get_user_notifications);
router.get("/users", userAuth, userController.get_other_users);
router.get("/transaction-pin-status", userAuth, userController.check_if_user_has_transaction_pin);
router.get("/login-pin-status", userAuth, userController.check_if_user_has_login_pin);
router.get(`/${process.env.FUND_LIMIT_RESET_ROUTE}`, userController.fund_limit_reset);

module.exports = router;
