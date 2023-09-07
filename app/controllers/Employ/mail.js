const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const sendVerificationMail = async (
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
    const configForTest = {
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "cornell.blick4@ethereal.email",
        pass: "FbT48CT99ASJCeHm9G",
      },
    };

    //By using google
    // const configForTest = {
    //   host: "email",
    //   auth: {
    //     user: `${process.env.MAILER_DEV_USER_ID}`,
    //     pass: `${process.env.MAILER_DEV_USER_PASS}`,
    //   },
    // };

    //Connect with smpt
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
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: " + info.response);
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendVerificationMail;

// const mailOptions = {
//     from: 'snehjaiswal704951@gmail.com',
//     to: to,
//     subject: "Email Verification",
//     html: `
//       <div style="max-width: 500px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
//           <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome!!! in Zecdata Technology</h2>
//           <a  style="color: black; padding: 40px 20px; margin: 10px 10; display: inline-block;">$</a>
//       </div>`,
//     // attachments: [
//     //     {
//     //         path: `/home/hp / Downloads/${pathname}.pdf`,
//     //         filename: `${pathname}.pdf`,
//     //         contentType: 'application/pdf'
//     //     }
//     // ]
// };
