const express = require('express')
const router = express.Router()
const { retrieve } = require('../controllers/user')

router.get('/:id', retrieve)

module.exports = router