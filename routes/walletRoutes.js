const { Router } = require("express");
const { userAuth } = require("../middlewares/userAuth");
const walletController = require("../controllers/walletController");

const router = Router();

router.post("/create", userAuth, walletController.create_wallet);
router.get("/balance", userAuth, walletController.get_wallet_balance);
router.put("/fund", userAuth, walletController.fund_wallet);
router.post("/transfer", userAuth, walletController.transfer_fund);
router.post("/withdrawal", userAuth, walletController.withdraw_from_wallet);

module.exports = router;
