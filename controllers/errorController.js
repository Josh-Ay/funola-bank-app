// 404 controller handler
exports.handle_404_requests = (req, res, next) => {
    res.status(404).send({"message": "Requested resource unavailable!"});
}