const { Router } = require("express");
const { userAuth } = require("../middlewares/userAuth");
const cardController = require("../controllers/cardController");

const router = Router();

router.post("/create/:type", userAuth, cardController.create_new_card);
router.get("/detail", userAuth, cardController.get_card_detail);
router.post("/fund/:currency", userAuth, cardController.fund_card);
router.get("/transactions/:currency", userAuth, cardController.fetch_card_transactions);


module.exports = router;
