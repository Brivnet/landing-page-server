const crypto = require('crypto')

const utilities = {}

utilities.isJSON = (data)=>{
    
    try{
        JSON.parse(data)
        return true
    }
    catch{
        return false
    }
}


utilities.setResponseData = (res, status, headers, data, isJSON)=>{
    res.status(status)
    const headerKeys = Object.keys(headers)
    for(let key of headerKeys){
        res.set(key, headers[key])
    }

    if(isJSON){
        res.json(data)
    }
    else{res.send(data)}

    return res.end()
}

utilities.dataHasher = (data)=>{
    if(typeof data == "string" && data.length > 0){

        return crypto.createHmac("sha256", process.env.HASH_STRING).update(data).digest('hex')
    }
    return false
}


utilities.clientDataValidator = (data, expectedData)=>{
    const emailRegex = /^[a-zA-Z0-9\+\.]+@[a-zA-Z]+\.[a-z]+$/
    const phoneNoRegex = /^[0-9]{11}$/

    const dataKeys = Object.keys(data)
    
    if(dataKeys.length === expectedData.length){
        for(let i of dataKeys){
            if(i === "name" && (typeof data[i] !== "string" || data[i].trim().length < 1)){
                return {
                    isValid: false,
                    errorField: i,
                    msg: `${i} should be a string and it should not be empty`
                }
            }

            if(i === "email" && (typeof data[i] !== "string" || !emailRegex.test(data[i].trim()))){
                return {
                    isValid: false,
                    errorField: i,
                    msg: `${i} should be in valid email format`
                }
            }

            if(i === "phoneNo" && (typeof data[i] !== "string" || !phoneNoRegex.test(data[i].trim()))){
                return {
                    isValid: false,
                    errorField: i,
                    msg: `wrong phone number format`
                }
            }


            if(i === "message" && (typeof data[i] !== "string")){
                return {
                    isValid: false,
                    errorField: i,
                    msg: `message should not be empty`
                }
            }
        }

        return{
            isValid: true,
            errorField: null,
        }

    }
    else{
        return {
            isValid: false,
            msg: `incomplete data or unrequired data detected`
        }
    }
}


utilities.adminLoginValidator = (data, expectedData)=>{
    const emailRegex = /^[a-zA-Z0-9\+\.]+@[a-zA-Z]+\.[a-z]+$/

    const dataKeys = Object.keys(data)
    
    if(dataKeys.length === expectedData.length){
        for(let i of dataKeys){
            
            if(i === "email" && (typeof data[i] !== "string" || !emailRegex.test(data[i].trim()))){
                return {
                    isValid: false,
                    errorField: i,
                    msg: `${i} should be in valid email format`
                }
            }

            if(i === "password" && (typeof data[i] !== "string")){
                return {
                    isValid: false,
                    errorField: i,
                    msg: `password should not be empty`
                }
            }
        }

        return{
            isValid: true,
            errorField: null,
        }

    }
    else{
        return {
            isValid: false,
            msg: `incomplete data or unrequired data detected`
        }
    }
}


utilities.emailValidator = (data, expectedData)=>{
    const emailRegex = /^[a-zA-Z0-9\+\.]+@[a-zA-Z]+\.[a-z]+$/

    const dataKeys = Object.keys(data)
    
    if(dataKeys.length === expectedData.length){
        for(let i of dataKeys){
            
            if(i === "email" && (typeof data[i] !== "string" || !emailRegex.test(data[i].trim()))){
                return {
                    isValid: false,
                    errorField: i,
                    msg: `${i} should be in valid email format`
                }
            }
        }

        return{
            isValid: true,
            errorField: null,
        }

    }
    else{
        return {
            isValid: false,
            msg: `incomplete data or unrequired data detected`
        }
    }
}

module.exports = utilities