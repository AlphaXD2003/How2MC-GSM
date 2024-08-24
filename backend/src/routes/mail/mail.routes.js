const {Router} = require('express')
const {sendMail} = require('../../controllers/mail/mail.controller')
const router = Router()

router.route('/').post(sendMail)

module.exports = router