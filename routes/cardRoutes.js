const { Router } = require("express");
const { userAuth } = require("../middlewares/userAuth");
const cardController = require("../controllers/cardController");

const router = Router();

router.post("/create/:cardType", userAuth, cardController.create_new_card);
router.get("/detail/:id", userAuth, cardController.get_card_detail);
router.post("/fund/:cardType/:id", userAuth, cardController.fund_card);
router.get("/transactions/:cardType/:id", userAuth, cardController.fetch_card_transactions);


module.exports = router;
