const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transport with using email and password of sender
const transport = nodemailer.createTransport({
	service: "Zoho",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

const sendConfirmationEmail = (
	first_name,
	email,
	confirmationCode
) => {
	transport
		.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Please confirm your account",
			html: `
          <h2>Hello ${first_name}</h2>
          <p>Thank you for joining Worldowe. Please confirm your email by clicking on the following link</p>
          <a href=${process.env.CLIENT_URI}/users/verify/${confirmationCode}> Click here</a>
          </div>`,
		})
		.catch((err) =>
			console.log(
				"An internal error has occured while trying to send email. Please try again later\n" +
				err
			)
		);
};

const sendResetPasswordEmail = (token, email) => {
	transport.sendMail({
		from: process.env.EMAIL_USER,
		to: email,
		subject: "reset password",
		html: `
    <p>Hello</p>
    <a href=${process.env.CLIENT_URI}/reset-password/${token}> Click here</a>
    `,
	})
		.catch((err) => err);
};

module.exports = {
	sendConfirmationEmail,
	sendResetPasswordEmail

}
