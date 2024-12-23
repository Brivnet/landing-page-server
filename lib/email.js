const sgMail = require("@sendgrid/mail")

const email = {}

email.sendContactMessage = async(clientData, clientMessage)=>{

    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: "info@brivnet.com", // Change to your recipient
            from: `Brivnet <info@brivnet.com>`, // Change to your verified sender
            subject: 'Contact form Message',
            text: `${clientMessage}
            name: ${clientData.name}
            email: ${clientData.email}
            phone num: ${clientData.phoneNo}
            `,
            html: `<strong>${clientMessage}<br><br>
            name: ${clientData.name}<br>
            email: ${clientData.email}<br>
            phone num: ${clientData.phoneNo}</strong>`,
            replyTo: clientData.email
            
        }
        await sgMail.send(msg)
        return {isSuccessful: true}

    } catch (error) {
        console.error(error)
        return {isSuccessful: false}
    }  

}

module.exports = email

//`${clientData.name} <${clientData.email}>`

/*`${clientMessage}
            name: ${clientData.name}
            email: ${clientData.email}
            phone num: ${clientData.phoneNo}
            `*/


            /*<strong>${clientMessage}
            name: ${clientData.name}
            email: ${clientData.email}
            phone num: ${clientData.phoneNo}</strong>*/