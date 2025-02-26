const nodemailer = require("nodemailer");

const mailSender = async (mailOptions) => {
  try {
    var transport = nodemailer.createTransport({
      host: process.env.HOST_MAIL,
      port: process.env.PORT_MAIL,
      auth: {
        user: process.env.USER_NAME,
        pass: process.env.PASS_WORD,
      },
    });
    
    const info = await transport.sendMail(mailOptions);
    console.log("Email info----------", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;
