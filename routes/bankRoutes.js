const bankController = require('../controllers/bankController');
const { Router } = require("express");
const { userAuth } = require('../middlewares/userAuth');
const { validateMongoIdParam } = require('../middlewares/validateMongoIdParam');

const router = Router();

router.get("/", userAuth, bankController.get_banks);
router.post("/new", userAuth, bankController.add_new_bank);
router.patch("/update/:id", [userAuth, validateMongoIdParam], bankController.update_bank_detail);
router.delete("/delete/:id", [userAuth, validateMongoIdParam], bankController.delete_bank);

module.exports = router;
