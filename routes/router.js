const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser');

router.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next()
})

router.use(cookieParser());

const clientController = require("../controllers/clientController/clientController")
const adminController = require("../controllers/adminController/adminController")
const adminAuth = require("../controllers/adminController/adminAuth")

const {bodyParser, isJSON, isJwtValid, isAdmin} = require("../lib/middleware")

router.get("/api", (req, res)=>{
    res.send("hello world")
    return
})

router.post("/add-client", bodyParser, isJSON, clientController.addClient)
router.post("/add-to-email-list", bodyParser, isJSON, clientController.addToEmailList)

router.put("/admin/login", bodyParser, isJSON, adminAuth.login)
router.get("/admin/get-client-messages", isJwtValid, isAdmin, adminController.getClientMessages)
router.delete("/admin/delete-client-message", isJwtValid, isAdmin, adminController.deleteClientMessage)
router.get("/admin/logout", isJwtValid, isAdmin, adminController.logout)


//test
router.get("/admin/get-all-clients", isJwtValid, isAdmin, adminController.getAllClients)
router.get("/admin/get-email-list", isJwtValid, isAdmin, adminController.getEmailList)
router.get("/admin/get-client", isJwtValid, isAdmin, adminController.getClient)
router.put("/admin/get-client-by-name", bodyParser, isJwtValid, isAdmin, isJSON, adminController.getClientByName)
router.put("/admin/commit-client", bodyParser, isJwtValid, isAdmin, isJSON, adminController.commitClient)
router.get("/admin/get-client-stats", isJwtValid, isAdmin, adminController.getClientStats)
module.exports = router