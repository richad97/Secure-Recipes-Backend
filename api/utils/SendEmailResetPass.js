const nodemailer = require("nodemailer");
const resetPassTokenBuilder = require("../users/resetpass-token-builder");
const { GMAIL, GMAIL_PASS } = process.env;

const sendEmailResetPass = async (email) => {
  const emailToken = resetPassTokenBuilder(email);
  const url = `https://meek-klepon-9ced87.netlify.app/resetpassword/${emailToken}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: GMAIL,
      pass: GMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Secret Recipes" <bb6885302@gmail.com>',
    to: email,
    subject: "Reset Password",
    html: `<p>Please click on link to reset password.</p><a href=${url}>${url}</a>`,
  });

  console.log("Message sent: %s", info.messageId);

  return info;
};

module.exports = sendEmailResetPass;
