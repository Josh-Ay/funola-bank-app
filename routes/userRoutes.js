const { Router } = require("express");
const userController = require("../controllers/userController");
const { userAuth } = require("../middlewares/userAuth");

const router = Router();

router.get("/profile", userAuth, userController.get_user_profile);
router.put("/update-profile/:updateType", userAuth, userController.update_user_detail);
router.get("/notifications", userAuth, userController.get_user_notifications);
router.get("/users", userAuth, userController.get_other_users);
router.get(process.env.FUND_LIMIT_RESET_ROUTE, userController.fund_limit_reset);

module.exports = router;