// "use strict";

const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MANGODB_DEV_URL);
    console.log(`Connecting to mongooseDB: ${conn.connection.host}`);
  } catch (e) {
    console.log(`Error in mongoDB: ${e}`);
  }
};

module.exports = connectDB;

// require("dotenv").config();
// // const url =`mongodb+srv://${process.env.mongo_pass}:${process.env.mongo_pass}@cluster0.9bxysok.mongodb.net/?retryWrites=true&w=majority`
// const url = `mongodb+srv://payroll:payroll123@cluster0.8pzycmy.mongodb.net/?retryWrites=true&w=majority`;
// // const url = `mongodb+srv://payroll:payroll321@payrollcluster.yeqrxfh.mongodb.net/`
// // hr @ zecdata bali url
// // const  url  =`mongodb+srv://payroll_system:payroll321@cluster0.t6qhawt.mongodb.net/`
// connect(url, (error) => {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   connection.useDb("employees");
//   console.log("Connected to MongoDB");
// });
