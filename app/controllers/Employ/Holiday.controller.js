//"use strict";
const express = require("express");
const HolidayModal = require("../../models/Employ/Holiday.modal");
const moment = require("moment");

class Holiday {
  //Get holiday
  async holiday(req, res) {
    try {
      let { holiday_name, holiday_type, holiday_date } = req.body;
      // CHECK ALL FIELD IN FILL
      const holiday_date_ = await HolidayModal.findOne({
        holiday_date: holiday_date,
      });

      if (!holiday_name || !holiday_type || !holiday_date)
        return res.send({ message: "Please fill in all fields." });

      if (holiday_date_) {
        return res.send({ message: "alredy exist date." });
      }
      const leave = new HolidayModal({
        holiday_name,
        holiday_type,
        holiday_date,
      });

      //STORE YOUR LOGIN DATA IN DB
      await leave.save();
      //   console.log({ leave });
      res.status(200).send({ message: "Success " });
      // res.status(200).send({ success: true })
    } catch (error) {
      // res.send("Error-", error);
      res.status(400).send({ status: false, error: error });
    }
  }

  async get_Holiday_all(req, res, next) {
    try {
      console.log("get_Holiday_all");
      var FromDate = req.body.from_date;
      var EndDate = req.body.end_date;
      //$and: [{ age: { $gte: 25 } }];
      HolidayModal.find({
        $and: [
          {
            holiday_date: { $gte: new Date(FromDate), $lt: new Date(EndDate) },
          },

          {
            $or: [{ holiday_type: "Public" }, { holiday_type: "Weekend" }],
          },
        ],
      })
        .then(function (employee) {
          console.log("get_Holiday_all => 2");
          res.status(200).send(employee);
        })
        .catch(next);
    } catch (err) {
      res.send({ error: err });
      console.log(err);
    }
  }

  async get_holiday(req, res, next) {
    try {
      console.log("get_holiday");
      var FromDate = req.body.from_date;
      var EndDate = req.body.end_date;
      HolidayModal.find({
        holiday_date: { $gte: new Date(FromDate), $lt: new Date(EndDate) },
      })
        .sort({ _id: -1 })
        .then(function (employee) {
          console.log("get_holiday 1");
          res.send(employee);
        })
        .catch(next);
    } catch (err) {
      res.send({ error: err });
    }
  }

  async get_Fastival(req, res, next) {
    try {
      var FromDate = req.body.from_date;
      var EndDate = req.body.end_date;
      $and: [{ age: { $gte: 25 } }];
      HolidayModal.find({
        $and: [
          {
            holiday_date: { $gte: new Date(FromDate), $lt: new Date(EndDate) },
          },

          {
            $or: [
              { holiday_type: "Public" },
              // { holiday_type: 'independence day' },
              // { holiday_type: ' gandhi jayanti' },
              // { holiday_type: 'public holiday' },
              // { holiday_type: '   weekend' },
            ],
          },
        ],
      })
        .then(function (employee) {
          res.send(employee);
        })
        .catch(next);
    } catch (err) {
      res.send({ error: err });
      console.log(err);
    }
  }

  async update_holiday(req, res) {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }

    const id = req.params.id;
    const { holiday_name, holiday_type, holiday_date } = req.body;
    HolidayModal.findByIdAndUpdate(
      id,

      {
        holiday_name,
        holiday_type,
        holiday_date,
      }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update =${id}`,
          });
        } else res.send({ message: "updated successfully." });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating=" + id,
        });
        console.log(err);
      });
  }

  async holiday_delete(req, res) {
    try {
      const userDelete = await HolidayModal.findByIdAndDelete(req.params.id);

      res.status(201).json({ message: "delete successfuly" });
      console.log({ userDelete });
    } catch (error) {
      res.send({ error });
    }
  }
}
module.exports = new Holiday();
