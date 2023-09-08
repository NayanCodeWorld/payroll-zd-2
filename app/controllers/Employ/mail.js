const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const EmpInfoModal = require("../../models/Employ/Employ.model");

const LEAVE_STATUS = {
  0: "Pending",
  1: "Accepted",
  2: "Rejected",
};

const sendLeaveMail = async (
  From,
  employeeName,
  startDate,
  endDate,
  reason
) => {
  try {
    const To = `${process.env.MAILER_DEV_USER_ID}`;
    const companyName = "Zecdata";
    const supervisorName = "HR";

    // By using ethereal
    // const configForTest = {
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: "cornell.blick4@ethereal.email",
    //     pass: "FbT48CT99ASJCeHm9G",
    //   },
    // };

    //By using google
    const configForTest = {
      service: "gmail",
      auth: {
        user: `${process.env.MAILER_DEV_USER_ID}`,
        pass: `${process.env.MAILER_DEV_USER_PASS}`,
      },
    };

    //Connect with smpt or server
    const transporter = nodemailer.createTransport(configForTest);

    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("./views/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./views/"),
    };

    // Useing a template file with nodemailer
    transporter.use("compile", hbs(handlebarOptions));

    let mailOptions = {
      from: From, //'"HR Zecdata" <hr@zecdata.com>', // sender address //
      to: To, // list of receivers
      subject: "Leave Request",
      template: "leave-request",
      context: {
        supervisorName,
        employeeName,
        startDate,
        endDate,
        reason,
        companyName,
      },
    };

    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("70 >>", error, info);
      }
      console.log("Message sent: " + info.response);
    });
  } catch (err) {
    console.log(err);
  }
};

const replayMail = async (user_id, replay) => {
  try {
    //const To = `${process.env.MAILER_DEV_USER_ID}`;
    const companyName = "Zecdata";
    const supervisorName = "HR";
    const From = process.env.HR_MAIL_ID;
    let employeeName = "";
    let Replay = LEAVE_STATUS[replay];

    //By using google
    const configForTest = {
      service: "gmail",
      auth: {
        user: `${process.env.MAILER_DEV_USER_ID}`,
        pass: `${process.env.MAILER_DEV_USER_PASS}`,
      },
    };

    //Connect with smpt or server
    const transporter = nodemailer.createTransport(configForTest);

    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("./views/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./views/"),
    };

    // Useing a template file with nodemailer
    transporter.use("compile", hbs(handlebarOptions));

    employeeName = await EmpInfoModal.find({ _id: user_id })
      .then((res) => res[0].First_Name)
      .catch((err) => console.log(err));

    let mailOptions = {
      from: From, //'"HR Zecdata" <hr@zecdata.com>', // sender address //
      to: "nayan.dwivedi28@gmail.com", // list of receivers
      subject: "Replay",
      template: "replay",
      context: {
        employeeName,
        Replay,
        companyName,
      },
    };

    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("70 >>", error, info);
      }
      console.log("Message sent: " + info.response);
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendLeaveMail, replayMail };
