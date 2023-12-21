import nodemailer from "nodemailer";

const { UKRNET_PASSWD, UKRNET_EMAIL } = process.env;

const nodemailerConfig = {
   host: "smtp.ukr.net",
   port: 465,
   secure: true,
   auth: {
      user: UKRNET_EMAIL,
      pass: UKRNET_PASSWD,
   },
};
const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
   const email = { ...data, from: UKRNET_EMAIL };
   return transport.sendMail(email);
};

export default sendEmail;
