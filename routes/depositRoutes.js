const { Router } = require("express");
const { userAuth } = require("../middlewares/userAuth");
const depositController = require("../controllers/depositController");

const router = Router();

router.get("/", userAuth, depositController.get_deposits);
router.post("/new", userAuth, depositController.make_new_deposit);


module.exports = router;
