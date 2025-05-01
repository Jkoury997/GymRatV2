// routes/userRoutes.js

const authRoute = require("./authRoute")
const recoveryRoute = require("./recoveryRoute")
const roleRoute = require("./roleRoute")
const trainerRoute = require("./trainerRoute")
const userRoute = require("./userRoute")
const verifyTokenWithRoles = require('../middlewares/verifyTokenWithRoles');

const express = require("express")



const router = express.Router();

router.use('/auth', authRoute); //Seguridad completa
router.use('/recovery',recoveryRoute)
router.use("/role",verifyTokenWithRoles(['admin']),roleRoute)
router.use('/trainer',verifyTokenWithRoles(['admin','trainer',"user"]),trainerRoute)
router.use('/user',userRoute)


module.exports = router