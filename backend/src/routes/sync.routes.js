const {Router} = require('express')
const syncDB = require('../controllers/syncDB.controller')
const router = Router()

router.get('/', syncDB)

module.exports = router