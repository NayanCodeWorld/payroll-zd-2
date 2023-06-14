"use strict";
require('./app/utils/mongooseConnecter.util')
const express = require("express");
const app = express();
const pdf_genearation = require("./pdf_generator/pdfGenerator")
const path = require('path')
//const https = require('https');
//const fs = require('fs');


const cors = require('cors');
app.use(cors())
require('dotenv').config();

process.noDeprecation = true;

const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));

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
 
app.use("/", require("./app/routes/Employ/Employ.route"));
app.use("/emp", require("./app/routes/Employ/Employ.route"));
app.use("/Emp_Leave",require("./app/routes/Employ/Leave.route"))
app.use("/Emp_Salary",require("./app/routes/Employ/Salary.route"))
app.use("/Holiday",require("./app/routes/Employ/Holiday.route"))
app.use("/login",require("./app/routes/Employ/login.route"))
app.use("/year",require("./app/routes/Employ/Year_Leave.route"))
app.use("/eff", require("./app/routes/Employ/Effective.route"))


app.get('/slip', (req, res) =>{
  res.sendFile(__dirname + '/pdf_generator/salarySlip.html')
})


app.post('/slip', (req, res) =>{
  pdf_genearation()
  console.log("button clicked")
  res.send("file downloaded successfully")
})

// read static files
app.use(express.static(path.join(__dirname, './payroll-front/build')))
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, './payroll-front/build/index.html'))
})

const port = 7074;

// Server start
app.listen(port, () =>
  console.log(`Server is running on ${port}`)
);


