var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "tls://smtp.gmail.com",
    service: 'gmail',
    port: 587,
    auth: {
        user: 'anmol.r@zecdata.com',
        pass: 'hzuiwejwhtuzuspa',
    }
});

function sendVerificationMail(to, pathname, text) {
    console.log("to", to);
    //   console.log("url",url);
    const mailOptions = {
        from: 'snehjaiswal704951@gmail.com',
        to: to,
        subject: "Email Verification",
        html: `
  		<div style="max-width: 500px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
  			<h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome!!! in Zecdata Technology</h2>
  			<a  style="color: black; padding: 40px 20px; margin: 10px 10; display: inline-block;">$</a>
  		</div>`,
        // attachments: [
        //     {
        //         path: `/home/hp / Downloads/${pathname}.pdf`,
        //         filename: `${pathname}.pdf`,
        //         contentType: 'application/pdf'
        //     }
        // ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}
module.exports = sendVerificationMail