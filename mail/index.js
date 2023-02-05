const nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL
    }
})

