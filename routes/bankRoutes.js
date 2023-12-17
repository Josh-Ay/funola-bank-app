const bankController = require('../controllers/bankController');
const { Router } = require("express");
const { userAuth } = require('../middlewares/userAuth');

const router = Router();

router.get("/", userAuth, bankController.get_banks);
router.post("/new", userAuth, bankController.add_new_bank);
router.patch("/update/:id", userAuth, bankController.update_bank_detail);

module.exports = router;
