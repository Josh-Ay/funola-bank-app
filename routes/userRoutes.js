const { Router } = require("express");
const userController = require("../controllers/userController");
const { userAuth } = require("../middlewares/userAuth");

const router = Router();

router.get("/profile", userAuth, userController.get_user_profile);
router.put("/update-profile/:updateType", userAuth, userController.update_user_detail);

module.exports = router;
