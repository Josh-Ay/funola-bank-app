const { Router } = require("express");
const testController = require("../controllers/testController");

const router = Router();

router.get('/status', testController.get_api_status);

module.exports = router;
