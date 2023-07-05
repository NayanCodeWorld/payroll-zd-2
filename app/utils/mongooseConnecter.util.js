"use strict";

const { connect, connection } = require("mongoose");
require('dotenv').config();
// const url =`mongodb+srv://${process.env.mongo_pass}:${process.env.mongo_pass}@cluster0.9bxysok.mongodb.net/?retryWrites=true&w=majority`
const url = `mongodb+srv://payroll:payroll123@cluster0.8pzycmy.mongodb.net/?retryWrites=true&w=majority`
// const url = `mongodb+srv://payroll:payroll321@payrollcluster.yeqrxfh.mongodb.net/`
// hr @ zecdata bali url 
// const  url  =`mongodb+srv://payroll_system:payroll321@cluster0.t6qhawt.mongodb.net/`
connect(url, (error) => {
  if (error) {
    console.log(error);
    return;
  }
  connection.useDb('employees');
  console.log("Connected to MongoDB");
});

