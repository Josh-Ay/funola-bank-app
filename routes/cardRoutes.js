const { Router } = require("express");
const { userAuth } = require("../middlewares/userAuth");
const cardController = require("../controllers/cardController");
const { validateMongoIdParam } = require("../middlewares/validateMongoIdParam");
const { checkFundingLimit } = require("../middlewares/checkFundingLimit");

const router = Router();

router.post("/create/:cardType", userAuth, cardController.create_new_card);
router.get("/detail", userAuth, cardController.get_card_detail);
router.post("/fund/:id", [userAuth, validateMongoIdParam, checkFundingLimit], cardController.fund_card);
router.get("/transactions/:id", [userAuth, validateMongoIdParam], cardController.fetch_card_transactions);
router.patch("/update-setting/:id/:type", [userAuth, validateMongoIdParam], cardController.update_card_setting);
router.get("/single-card-detail/:id", [userAuth, validateMongoIdParam], cardController.get_single_card_detail);


module.exports = router;
