const utilities = require("../../lib/utilities")
const database = require("../../lib/database")

const clientController = {}

clientController.addClient = ("/add-client", async (req, res)=>{
    try {
        const payload = JSON.parse(req.body)
        //Validate payload
        const paylodStatus = utilities.clientDataValidator(payload, ["name", "email", "phoneNo", "message"])
        if(!paylodStatus.isValid){
            utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, msg: paylodStatus.msg}, true)
            return
        }
        const message = payload.message
        delete payload.message
        //store data
        payload.commited = false
        const client = await database.insertOne(payload, database.collection.clients)
        //store messages in the clientMessages collection
        const clientMessage = {clientID: client.insertedId , message, read: false}
        await database.insertOne(clientMessage, database.collection.clientMessages)

        utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: {msg: "success"}}, true)
    } 
    catch (err) {
        console.log(err)    
        utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
        return
    }
    
})


clientController.addToEmailList = ("/add-to-email-list", async (req, res)=>{
    try {
        const payload = JSON.parse(req.body)
        //Validate payload
        const paylodStatus = utilities.emailValidator(payload, ["email"])
        if(!paylodStatus.isValid){
            utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, msg: paylodStatus.msg}, true)
            return
        }
        
        //store data in email list
        const client = await database.insertOne(payload, database.collection.emailList)

        utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: {msg: "success"}}, true)
    } 
    catch (err) {
        console.log(err)    
        utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
        return
    }
    
})


module.exports = clientController