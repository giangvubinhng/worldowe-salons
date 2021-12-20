const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
	transport
		.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: 'Please confirm your account',
			html: `
          <h2>Hello ${name}</h2>
          <p>Thank you for joining Worldowe. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
          </div>`,
		})
		.catch((err) => console.log("An internal error has occured while trying to send email. Please try again later\n" + err));
};
