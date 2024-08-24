const nodemailer = require("nodemailer");
const { ApiErrors } = require("../../utils/ApiErrors");
const { ApiResponse } = require("../../utils/ApiResponse");
const { SMTP_SERVER, SMPTP_PORT, SMPTP_USER, SMPTP_PASS, SMPTP_SECURE } =
  process.env;
//Email configuration
const transportObj = {
  service: "gmail",
  host: SMTP_SERVER,
  port: SMPTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: SMPTP_USER, // generated ethereal user
    pass: SMPTP_PASS, // generated ethereal password
  },
};
const transporter = nodemailer.createTransport(transportObj);

const sendMail = async (req, res) => {
  const { to, subject, body } = req.body;

  if ([to, subject, body].some((field) => !field)) {
    return res
      .status(400)
      .json(new ApiErrors(400, "Missing Fields while mailing"));
  }
  const mailOptions = {
    from: SMPTP_USER,
    to,
    subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        //console.log(error);
        return res
          .status(500)
          .json(new ApiErrors(500, "Error while sending mail"));
      }
      return res
        .status(200)
        .json(new ApiResponse(200, "Mail sent successfully"));
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Error while sending mail"));
  }
};

module.exports = {
  sendMail,
};
