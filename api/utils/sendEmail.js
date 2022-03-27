const nodemailer = require("nodemailer");
const { GMAIL, GMAIL_PASS } = process.env;

const sendEmail = async (email, jwtCallback, subjectStr, urlStr) => {
  const emailToken = jwtCallback(email);
  const url = `https://meek-klepon-9ced87.netlify.app/${urlStr}/${emailToken}`;

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
    subject: subjectStr,
    html: `<p>Please click on link to proceed.</p><a href=${url}>${url}</a>`,
  });

  console.log("Message sent: %s", info.messageId);

  return info;
};

module.exports = sendEmail;
