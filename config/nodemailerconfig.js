const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'engr.umerfarooq68@gmail.com',//write your email
    pass: ''//write your password 
  }
});

module.exports = transporter;