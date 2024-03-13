const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

const {signupUser, loginUser, getUserData, updateUser, forgotPassword, resetPassword} = require('../controllers/userController')


router.post("/login", loginUser)
router.post("/signup", signupUser)
router.post ("/forgotPassword", forgotPassword)
router.get("/resetPassword/:id/:token", resetPassword)

router.use(requireAuth)

router.get("/data", getUserData);
router.post("/update", updateUser);
module.exports = router


