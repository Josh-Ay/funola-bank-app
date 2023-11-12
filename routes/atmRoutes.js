const { Router } = require("express");
const { adminAuth, userAuth } = require("../middlewares/userAuth");
const atmController = require("../controllers/atmController");

const router = Router();

router.post("/new", adminAuth, atmController.add_new_atm_entry);
router.get("/nearby-atms", userAuth, atmController.get_nearby_atms);
router.post("/find-atms", userAuth, atmController.find_atms_within_distance);

module.exports = router;