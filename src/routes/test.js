const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    return res.send('OK')
})

router.get('/:x', (req, res) => {
    return res.send(req.params.x)
})

module.exports = router