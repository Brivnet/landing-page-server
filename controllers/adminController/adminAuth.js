const database = require("../../lib/database")
const utilities = require("../../lib/utilities")
const jwt = require('jsonwebtoken');

const adminAuth = {}

adminAuth.login = ("/login", async (req, res)=>{
    try {
        const payload = JSON.parse(req.body)

        //Validate payload 
        const paylodStatus = utilities.adminLoginValidator(payload, ["email", "password"])
        if(paylodStatus.isValid){
            // check if user exists
            const admin = await database.findOne({email: payload.email}, database.collection.admins)
            
            if(!admin){
                utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, responseData: {msg: "invalid email or password"}}, true)
                return
            }

            //hash password
            payload.password = utilities.dataHasher(payload.password)
            //check if password match
            if(payload.password != admin.password){
                utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, responseData: {msg: "invalid email or password"}}, true)
                return
            }

            //create token
            const token = jwt.sign({userID: admin._id.toString(), role: "admin"}, process.env.jwtKey, {expiresIn: '24h'} )
            delete admin.password
            //set token in cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None"
            })
            //send response
            utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: {admin}}, true)
            return
            
        }
        else{
            utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, responseData: {msg: paylodStatus.msg}}, true)
            return
        }
        
    } 
    catch (err) {
        console.log(err)    
        utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, responseData: "server error"}, true)
        return
    }
})

module.exports = adminAuth