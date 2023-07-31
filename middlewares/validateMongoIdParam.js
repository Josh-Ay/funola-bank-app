const { validateMongooseId } = require("../utils/utils");

exports.validateMongoIdParam = (req, res, next) => {
    const { id } = req.params;
    if (!id) return res.status(400).send("'id' required");
    if (!validateMongooseId(id)) return res.status(400).send("Invalid id provided");

    next();
}