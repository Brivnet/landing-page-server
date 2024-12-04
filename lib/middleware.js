const utilities = require("./utilities")
const jwt = require('jsonwebtoken');

const middleware = {}

middleware.bodyParser = (req, res, next)=>{
    let buffer = ''
    let exceededDataLimit = false
    req.on('data', (dataStream)=>{

        if(Buffer.byteLength(dataStream, 'utf8') > Math.pow(2, 24)){
            exceededDataLimit = true
        }
        buffer += dataStream
    })

    req.on('end', ()=>{
        if(!exceededDataLimit){
            req.body = buffer
            next()  
        }
        else{
            utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, responseData:'Data sent is too large'}, true ) 
        } 
    })
}

middleware.isJSON = (req, res, next)=>{

    if(utilities.isJSON(req.body)){
        next()
    }
    
    else{    
        utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, responseData: `Invalid format, payload should be in JSON format`}, true )
    } 
}

middleware.isJwtValid = async (req, res, next)=>{
  
    try{
        if(!req.cookies.token) return res.status(401).json({ error: 'unauthorized' });
        // Check if the token is valid
        jwt.verify(req.cookies.token, process.env.jwtKey, (err, decoded)=>{ 
            if (err) {
                utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, responseData: `Invalid token`}, true )
                return res.status(401).json({ error: 'Invalid token' });
            } 
            req.decodedToken = decoded;
            //setReq(req)
            next()
        })

    }
    catch(err){
        utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, responseData: `Invalid token; catch block`}, true )
        return
    }
     
}

middleware.isAdmin = async(req, res, next)=>{
    //ectract decoded token
    const decodedToken = req.decodedToken

    if(decodedToken.role === 'admin'){
        next()
        
    }
    else{
        utilities.setResponseData(res, 400, {'content-type': 'application/json'}, {statusCode: 400, msg: `You are not authorised to perform this task`}, true ) 
        return
    }
}

module.exports = middleware