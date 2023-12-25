const { Router } = require("express");
const { userAuth } = require("../middlewares/userAuth");
const walletController = require("../controllers/walletController");
const { checkFundingLimit } = require("../middlewares/checkFundingLimit");

const router = Router();

router.post("/create", userAuth, walletController.create_wallet);
router.get("/balance", userAuth, walletController.get_wallet_balance);
router.put("/fund", [userAuth, checkFundingLimit], walletController.fund_wallet);
router.post("/transfer/:type", userAuth, walletController.transfer_fund);
router.post("/withdrawal", userAuth, walletController.withdraw_from_wallet);
router.post("/swap", userAuth, walletController.swap_currency);
router.post("/request", userAuth, walletController.request_fund);

module.exports = router;
