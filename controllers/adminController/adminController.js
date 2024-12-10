const utilities = require("../../lib/utilities")
const database = require("../../lib/database")
const {ObjectId} = require("mongodb")

const adminController = {}

adminController.getClientMessages = ("/get-client-messages", async (req, res)=>{
    try {
        
      //get messages
      const messages = await database.db.collection(database.collection.clientMessages).aggregate([
        { $match: { read: false } },
        {
          $lookup: {
            from: 'clients',             // Name of the clients collection
            localField: 'clientID',      // Field from clientMessages
            foreignField: '_id',         // Field from clients
            as: 'clientInfo'             // Alias for the resulting array
          }
        },
        {
          $unwind: '$clientInfo'         // Deconstructs the array field from $lookup into individual documents
        }
      ]).toArray()
          

      utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: {messages}}, true)
      return
    } 
    catch (err) {
      console.log(err)    
      utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
      return
    }
    
})



adminController.getAllClients = ("/get-all-clients", async (req, res)=>{
  try {
      
    //Get al clients
    const clients = await database.findMany({}, database.collection.clients).toArray()
        

    utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: {clients}}, true)
    return
  } 
  catch (err) {
    console.log(err)    
    utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
    return
  }
  
})


adminController.getClient = ("/get-client", async (req, res)=>{
  try {
    const clientID = req.query.id
    //Get client
    const client = await database.findOne({_id: ObjectId.createFromHexString(clientID)}, database.collection.clients)
        

    utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: client}, true)
    return
  } 
  catch (err) {
    console.log(err)    
    utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
    return
  }
  
})


adminController.getClientByName = ("/get-client-by-name", async (req, res)=>{
  try {
    const clientName = JSON.parse(req.body).name
    const regex = new RegExp(`${clientName}`, 'i');
    //Get client
    const clients = await database.db.collection(database.collection.clients).find({name: {$regex: regex}}).toArray()
        

    utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: clients}, true)
    return
  } 
  catch (err) {
    console.log(err)    
    utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
    return
  }
  
})

adminController.commitClient = ("/commit-client", async (req, res)=>{
  try {
    const payload = JSON.parse(req.body)
    const clientID = ObjectId.createFromHexString(payload.id)
    //commit client
    await database.updateOne({_id: clientID}, database.collection.clients, {commited: true})
        

    utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: {msg: "success"}}, true)
    return
  } 
  catch (err) {
    console.log(err)    
    utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
    return
  }
  
})


adminController.getClientStats = ("/get-client-stats", async (req, res)=>{
  try {
    
    const clientCount = await database.db.collection(database.collection.clients).countDocuments()
    const commitedClientCount = await database.db.collection(database.collection.clients).countDocuments({commited: true})
    const uncommitedClientCount = await database.db.collection(database.collection.clients).countDocuments({commited: false})
        

    utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, responseData: {clientCount, commitedClientCount, uncommitedClientCount}}, true)
    return
  } 
  catch (err) {
    console.log(err)    
    utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
    return
  }
  
})



adminController.deleteClientMessage = ("admin/delete-message", async (req, res)=>{
  try {
    const msgID = req.query.ID

    if(!msgID){
      utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, msg: "invalid or no message ID"}, true)
      return
    }

    await database.deleteOne({_id: ObjectId.createFromHexString(msgID)}, database.collection.clientMessages)

    utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, msg: "Success"}, true)
    return
  } 
  catch (err) {
    console.log(err)    
    utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
    return
  }


})

adminController.logout = ("admin/logout", async (req, res)=>{
  try {
    // Clear the token cookie 

    res.cookie('token', '', { 
      httpOnly: true, 
      secure: true,
      sameSite: 'None', 
      expires: new Date(0) // Set the expiration date to a past date 
    }); 

    utilities.setResponseData(res, 200, {'content-type': 'application/json'}, {statusCode: 200, msg: "Success"}, true)
    return
    
  } 
  catch (err) {
    console.error(err.message);
    utilities.setResponseData(res, 500, {'content-type': 'application/json'}, {statusCode: 500, msg: "server error"}, true)
    return
  }  

})


module.exports = adminController