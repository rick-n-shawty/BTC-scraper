const NotFound = (req, res) => res.status(404).json({err: 'resouce not found'})
module.exports = NotFound