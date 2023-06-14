"use strict";
const express = require("express");
const { findOne } = require("../../models/Employ/Employ.model");
const EmpInfoModal = require('../../models/Employ/Employ.model');
const Emp_archInfoModal = require('../../models/Employ/Employ_arch_model')
const { check, validationResult } = require('express-validator');

const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

class Emp {
    async add_employ(req, res, next) {
        try {

            const { First_Name, Last_Name, date_of_birth, date_of_joining, gender,
                Contact_Number, Contact_Number_Home, Permanent_Address,
                Current_Address, email,
                fatherName, base_salary,
                Blood_Group, Marital_Status, PAN_No,
                ADHAR, Bank_No, Bank_IFSC, Alternate_Contact_number,
                Position, DEGREE, STREAM, YEAR_OF_PASSING
                , PASSED, PERCENTAGE_OF_MARKS, permanent_state,
                permanent_city, bonus,
                current_state, is_active, permanent_pin_code,
                current_city, current_pin_code, effective_date, training_days, notice_period, ctc
            } = req.body;

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                console.log("err=>", errors.array());
                res.send({ message: errors.array() })
            }



            const emailFind = await EmpInfoModal.findOne({ email: email })
            const Pan_no = await EmpInfoModal.findOne({ PAN_No: PAN_No })
            const adhar = await EmpInfoModal.findOne({ ADHAR: ADHAR })
            const last_emp = await EmpInfoModal.find().sort({ _id: -1 }).limit(1);
            var next_emp_code;
            console.log(last_emp == 0);
            if (last_emp == 0) {
                next_emp_code = "A-0001";
            }

            else {
                const last_emp_code = last_emp[0].Employee_Code;
                const splitted_emp_code = last_emp_code.split("-");
                var emp_code = Number(splitted_emp_code[1]) + 1;
                emp_code = emp_code.toString();
                while (emp_code.length < 4) emp_code = "0" + emp_code;
                next_emp_code = splitted_emp_code[0] + "-" + emp_code;
            }

            if (adhar) {
                return res.send({ message: "alredy exist ADHAR." })
            }

            if (Pan_no) {
                return res.send({ message: "alredy exist PAN_NO." })
            }
            if (emailFind) {
                return res.send({ message: "alredy exist emails." });
            }

            else {
                const employ = new EmpInfoModal({
                    First_Name: First_Name.charAt(0).toUpperCase() + First_Name.slice(1),
                    Last_Name: Last_Name.charAt(0).toUpperCase() + Last_Name.slice(1),
                    date_of_birth,
                    date_of_joining,
                    gender,
                    Contact_Number,
                    Contact_Number_Home,
                    Permanent_Address,
                    Current_Address,
                    email,
                    fatherName,
                    Alternate_Contact_number,
                    Blood_Group,
                    Marital_Status,
                    PAN_No,
                    permanent_state,
                    permanent_city,
                    current_state,
                    current_city,
                    base_salary_list: [{ salary_: base_salary, effective_date: effective_date }],
                    ADHAR,
                    Bank_No,
                    Bank_IFSC,
                    Position,
                    Employee_Code: next_emp_code,
                    DEGREE,
                    STREAM,
                    is_active,
                    PASSED,
                    PERCENTAGE_OF_MARKS,
                    permanent_pin_code,
                    training_days,
                    current_pin_code,
                    YEAR_OF_PASSING,
                    notice_period,
                    ctc,
                    bonus
                    // file,
                });
                //STORE YOUR LOGIN DATA IN DB 
                await employ.save();
                console.log({ employ });
                res.send({ message: "Success " });
            }
        }
        catch (error) {
            console.log(error);
            res.send({ message: error });
            Error.captureStackTrace(error);


        }
    }
    async get_user_id(req, res) {
        try {
            const data = await EmpInfoModal.find()
            var arr = []
            data.forEach((Val) => {
                arr.push(Val.id)
            })
            if (!arr) {
                return res.status(404).send({ message: " user id not  Exist." });
            }

            res.send(arr);
        } catch (err) {
            res.send({ "error": err })
        }

    }
    async get_emlpoy(req, res, next) {
        try {
            EmpInfoModal.find({ is_active: 1 }).sort({ _id: -1 }).then(function (employee) {
                res.send(employee);
            }).catch(next);
        } catch (err) {
            res.send({ "error": err })
        }
    }
    async udateStatus_emlpoy(req, res, next) {
        EmpInfoModal.findByIdAndUpdate(req.body.id, { is_active: req.body.status }).then(function (employee) {
            res.send(employee);
        }).catch(next);
    }

    async get_one_emp(req, res, next) {
        EmpInfoModal.findById(req.params.id).then((employee) => {
            console.log("data:", employee);
            if (!employee) {
                return res.status(404).send({ message: "This user not Exist." });
            }
            res.send(employee);
        }).catch((error) => {
            res.status(500).send(error);
        })

    }

    async emp_soft_delete(req, res) {
        try {
            const userDelete = await EmpInfoModal.findByIdAndDelete(req.params.id)
            if (!userDelete) {
                return res.status(404).send({ message: "This user not Exist." });
            }
            const employ = new Emp_archInfoModal({
                userid: req.params.id,
                First_Name: userDelete.First_Name,
                Last_Name: userDelete.Last_Name,
                date_of_birth: userDelete.date_of_birth,
                date_of_joining: userDelete.date_of_joining,
                gender: userDelete.gender,
                Contact_Number: userDelete.Contact_Number,
                Contact_Number_Home: userDelete.Contact_Number_Home,
                Permanent_Address: userDelete.Permanent_Address,
                Current_Address: userDelete.Current_Address,
                email: userDelete.email,
                fatherName: userDelete.fatherName,
                Alternate_Contact_number: userDelete.Alternate_Contact_number,
                Blood_Group: userDelete.Blood_Group,
                Marital_Status: userDelete.Marital_Status,
                PAN_No: userDelete.PAN_No,
                permanent_state: userDelete.permanent_state,
                permanent_city: userDelete.permanent_city,
                current_state: userDelete.current_state,
                current_city: userDelete.current_city,
                base_salary_list: userDelete.base_salary_list,
                ADHAR: userDelete.ADHAR,
                Bank_No: userDelete.Bank_No,
                Bank_IFSC: userDelete.Bank_IFSC,
                Position: userDelete.Position,
                Employee_Code: userDelete.Employee_Code,
                DEGREE: userDelete.DEGREE,
                STREAM: userDelete.STREAM,
                is_active: 0,
                PASSED: userDelete.PASSED,
                PERCENTAGE_OF_MARKS: userDelete.PERCENTAGE_OF_MARKS,
                permanent_pin_code: userDelete.permanent_pin_code,
                current_pin_code: userDelete.current_pin_code,
                YEAR_OF_PASSING: userDelete.YEAR_OF_PASSING
            })
            employ.save()
            res.status(201).json({ message: "delete successfuly" });
            console.log(userDelete);

        } catch (error) {
            console.log(error)
            res.send({ error });
        }
    }


    async emp_delete(req, res) {
        try {
            const userDelete = await EmpInfoModal.findByIdAndDelete(req.params.id)
            if (!userDelete) {
                return res.status(404).send({ message: "This user not Exist." });
            }
            res.status(201).json({ message: "delete successfuly" });
            console.log(userDelete);

        } catch (error) {
            res.send({ error });
        }
    }
    async emp_update(req, res) {

        const { First_Name, Last_Name, date_of_birth, date_of_joining, gender,
            Contact_Number, Contact_Number_Home, Permanent_Address,
            Current_Address, email,
            fatherName, base_salary,
            Blood_Group, Marital_Status, PAN_No,
            ADHAR, Bank_No, Bank_IFSC, Alternate_Contact_number,
            Position, DEGREE, STREAM, YEAR_OF_PASSING
            , PASSED, PERCENTAGE_OF_MARKS, permanent_state,
            permanent_city,
            current_state, is_active, permanent_pin_code,
            current_city, current_pin_code, effective_date, base_salary_list, training_days,
            notice_period,
            ctc,
            bonus
        } = req.body;

        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }


        const id = req.params.id;
        EmpInfoModal.findByIdAndUpdate(
            id,
            {
                First_Name: First_Name.charAt(0).toUpperCase() + First_Name.slice(1),
                Last_Name: Last_Name.charAt(0).toUpperCase() + Last_Name.slice(1),
                date_of_birth,
                date_of_joining,
                gender,
                Contact_Number,
                Contact_Number_Home,
                Permanent_Address,
                Current_Address,
                email,
                fatherName,
                Alternate_Contact_number,
                Blood_Group,
                Marital_Status,
                PAN_No,
                permanent_state,
                permanent_city,
                current_state,
                current_city,
                base_salary_list,
                ADHAR,
                Bank_No,
                Bank_IFSC,
                Position,
                DEGREE,
                STREAM,
                is_active,
                PASSED,
                PERCENTAGE_OF_MARKS,
                permanent_pin_code,
                current_pin_code,
                YEAR_OF_PASSING,
                training_days,
                notice_period,
                ctc,
                bonus
            }
        )
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update =${id}`
                    });
                } else res.send({ message: "updated successfully." });
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating=" + id, err
                });
                console.log(err)
            });
    }

}

module.exports = new Emp();
