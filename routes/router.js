const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser');

router.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
    next()
})

router.use(cookieParser());

const clientController = require("../controllers/clientController/clientController")
const adminController = require("../controllers/adminController/adminController")
const adminAuth = require("../controllers/adminController/adminAuth")

const {bodyParser, isJSON, isJwtValid, isAdmin} = require("../lib/middleware")

router.post("/add-client", bodyParser, isJSON, clientController.addClient)
router.put("/admin/login", bodyParser, isJSON, adminAuth.login)
router.get("/admin/get-client-messages", isJwtValid, isAdmin, adminController.getClientMessages)
router.delete("/admin/delete-client-message", isJwtValid, isAdmin, adminController.deleteClientMessage)
router.get("/admin/logout", isJwtValid, isAdmin, adminController.logout)
module.exports = router