const get_api_status = (req, res) => {
    res.status(200).send('API working fine');
}

module.exports = {
    get_api_status,
}