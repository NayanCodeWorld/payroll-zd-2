"use strict";

const express = require("express");
const ExcelJS = require("exceljs");
const https = require("https");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const bodyparser = require("body-parser");

const connectDB = require("./app/utils/mongooseConnecter.util");

// Create express instance
const app = express();

// configure env for useing environment variables
dotenv.config();

// Mondgodb connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "public")));
process.noDeprecation = true;

// Define options for HTTPS server
//const options = {
//  key: fs.readFileSync('/etc/letsencrypt/live/zecdata.com/privkey.pem'),
//  cert: fs.readFileSync('/etc/letsencrypt/live/zecdata.com/fullchain.pem'),
//  ca: [fs.readFileSync('/etc/letsencrypt/live/zecdata.com/ca-bundle.crt')],
//  requestCert: false,
//  rejectUnauthorized: false
//};

// Use HTTPS server instead of HTTP server
//const server = https.createServer(options, app);

// Routes
app.use("/", require("./app/routes/Employ/Employ.route"));
app.use("/emp", require("./app/routes/Employ/Employ.route"));
app.use("/Emp_Leave", require("./app/routes/Employ/Leave.route"));
app.use("/Emp_Salary", require("./app/routes/Employ/Salary.route"));
app.use("/Holiday", require("./app/routes/Employ/Holiday.route"));
app.use("/auth", require("./app/routes/Employ/login.route"));
app.use("/year", require("./app/routes/Employ/Year_Leave.route"));

// server went to the server code the

// const certPath = './ssl/fullchain.pem';
// const keyPath = './ssl/privkey.pem';

// const cert = fs.readFileSync(certPath);
// const key = fs.readFileSync(keyPath);

// const options = {
//   cert: cert,
//   key: key
// };
// const server = https.createServer(options, app);

//...........................................................................

// app.get("emp/get_employ", async (req, res) => {
//   const employee = await EmpInfoModal.find();
//   console.log("employee", employee);
//   return res.status(200).send(employee);
// });

//...........................................................................

app.post("/generate-excel", (req, res) => {
  const userData = req.body;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Users");

  // Set headers for Excel worksheet
  worksheet.addRow(["Name", "Age", "Email", "Department"]);

  // Add user data to Excel worksheet
  userData.forEach((user) => {
    worksheet.addRow([user.name, user.age, user.email, user.department]);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
});

// read static files
// app.use(express.static(path.join(__dirname, "./payroll-front/build")));
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./payroll-front/build/index.html"));
// });

// Server start
app.listen(process.env.DEV_PORT, () => {
  console.log(`Server running on port ${process.env.DEV_PORT}`);
});

console.log();
