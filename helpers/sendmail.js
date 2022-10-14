const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const emailHost = process.env.GOOGLE_EMAIL_HOST;
const passHost = process.env.GOOGLE_PASSWORD_HOST;

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: emailHost,
      pass: passHost,
    },
  })
);

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  const mailOptions = {
    from: emailHost,
    to: email,
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
      <h2>Hello ${name}</h2>
      <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href=https://resort-booking-v1.netlify.app/confirm?q=${confirmationCode}> Click here</a>
      </div>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
