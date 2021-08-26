const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{

    sgMail.send({
        to:email,
        from:'aabidhasan9711@gmail.com',
        subject:'Thanks for joining in!',
        text:`welcome to the app , ${name}.Let me know how you get along with the app`
    })
}

const cancelation = (email,name)=>{

    sgMail.send({
        to:email,
        from:'aabidhasan9711@gmail.com',
        subject:'Deleted your account',
        text:`Hey ${name} what's going wrong from our services . Is there anything we can do for you please do contact on my mail`
    })
}
module.exports = {
    sendWelcomeEmail,
    cancelation
}