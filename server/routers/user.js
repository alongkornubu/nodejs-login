const express = require('express')
const router = express.Router()
// controller
const {list,update,remove} = require('../controllers/user')
// middleware
const {auth} = require('../middleware/auth')

router.get('/users',auth,list)
router.patch('/users/:userId',update)
router.delete('/users/:userId',remove)


module.exports = router