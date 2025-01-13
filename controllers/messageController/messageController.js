const utilities = require("../../lib/utilities")
const database = require("../../lib/database")
const {ObjectId} = require("mongodb")

const messageController = {}

messageController.updateReadStatus = ("/update-read-status", async (req, res)=>{
    try {
        // get message ID
        const payload = JSON.parse(req.body)
        const messageID = ObjectId.createFromHexString(payload.id)

        //Update message status
        await database.updateOne({_id: messageID}, database.collection.clientMessages, {read: true})

      utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: {message: "success"}}, true)
      return
    } 
    catch (err) {
      console.log(err)    
      utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
      return
    }
    
})



module.exports = messageController