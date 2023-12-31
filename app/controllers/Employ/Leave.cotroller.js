"use strict";
const express = require("express");
const LeaveModal = require("../../models/Employ/leave.modal");
const EmpInfoModal = require("../../models/Employ/Employ.model");
const HolidayModal = require("../../models/Employ/Holiday.modal");
const moment = require("moment");
// const moment= require('moment-timezone');

const Emp = require("../Employ/EmpInfo.cotroller");
const { sendLeaveMail, replayMail } = require("./mail");

let month_array = [
  "31",
  "28",
  "31",
  "30",
  "31",
  "30",
  "31",
  "31",
  "30",
  "31",
  "30",
  "31",
];

class Leave {
  async Leave(req, res) {
    try {
      const {
        userid,
        user_role,
        leave_type,
        from_date,
        to_date,
        reason_for_leave,
      } = req.body;

      console.log({
        userid,
        user_role,
        leave_type,
        from_date,
        to_date,
        reason_for_leave,
      });

      function getMonthIntervals(start_date, end_date1) {
        const intervals = [];
        let current_date = new Date(start_date);
        let end_date = new Date(end_date1);
        while (current_date <= end_date) {
          const start_of_month = new Date(
            current_date.getFullYear(),
            current_date.getMonth(),
            1
          );
          const end_of_month = new Date(
            current_date.getFullYear(),
            current_date.getMonth() + 1,
            0
          );
          end_of_month.setMinutes(end_of_month.getMinutes() + 330);
          const end_of_interval =
            current_date < end_of_month ? end_of_month : current_date;
          intervals.push({
            start_date: current_date.toISOString().substring(0, 10),
            end_date: end_of_interval.toISOString().substring(0, 10),
          });
          current_date = new Date(
            current_date.getFullYear(),
            current_date.getMonth() + 1,
            1
          );
          current_date.setMinutes(current_date.getMinutes() + 330);
        }
        intervals[intervals.length - 1].end_date = end_date
          .toISOString()
          .substring(0, 10);

        return intervals;
      }

      //date range validation
      const user_data = await LeaveModal.find({ userid: userid });
      console.log("77 => leave =>> user_data =>>>", user_data);

      for (let i = 0; i < user_data.length; i++) {
        if (
          moment(from_date, "YYYY-MM-DD").isBetween(
            moment(user_data[i].from_date, "YYYY-MM-DD"),
            moment(user_data[i].to_date, "YYYY-MM-DD")
          ) ||
          moment(to_date, "YYYY-MM-DD").isBetween(
            moment(user_data[i].from_date, "YYYY-MM-DD"),
            moment(user_data[i].to_date, "YYYY-MM-DD")
          ) ||
          moment(user_data[i].from_date, "YYYY-MM-DD").isBetween(
            moment(from_date, "YYYY-MM-DD"),
            moment(to_date, "YYYY-MM-DD")
          ) ||
          moment(user_data[i].to_date, "YYYY-MM-DD").isBetween(
            moment(from_date, "YYYY-MM-DD"),
            moment(to_date, "YYYY-MM-DD")
          )
        ) {
          return res.send({ message: "applied date range already exist." });
        }
      }

      // console.log(user_data[i]);
      //     console.log(
      //       moment(from_date, "YYYY-MM-DD").isBetween(
      //         moment(user_data[i].from_date, "YYYY-MM-DD"),
      //         moment(user_data[i].to_date, "YYYY-MM-DD")
      //       )
      //     );
      //     console.log(
      //       moment(to_date, "YYYY-MM-DD").isBetween(
      //         moment(user_data[i].from_date, "YYYY-MM-DD"),
      //         moment(user_data[i].to_date, "YYYY-MM-DD")
      //       )
      //     );

      const datelFind = await LeaveModal.findOne({
        $and: [{ from_date: from_date }, { userid: userid }],
      });

      console.log("leave >> 107 => datelFind >>>", datelFind);
      var empinfo_modal = await EmpInfoModal.find({
        _id: userid,
      });
      console.log("leave >> 110 => empinfo_modal", empinfo_modal);
      empinfo_modal = empinfo_modal[0];

      let effective_leave = empinfo_modal.base_salary_list[0].effective_date
        .toISOString()
        .toString()
        .slice(0, 10);
      console.log("117 =>> leave =>>> effective_leave >>>", effective_leave);
      if (effective_leave > from_date) {
        console.log("119 =>> leave =>>> effective_leave > from_date is true");
        return res.send({
          message:
            "You can not take leave before effective date , You have to update effective date",
        });
      }

      // return
      // let dates = [];
      // for (let i = 0; i < user_data.length; i++) {
      //   const leave_from_date = user_data[i].from_date;
      //   const leave_to_date = user_data[i].to_date;
      //   console.log("132 ==> leave =>> leave_from_date =>>>", leave_from_date);
      //   console.log("133 ==> leave_to_date", leave_to_date);

      //   let currentDate = new Date(leave_from_date);
      //   let endDate = new Date(leave_to_date);
      //   console.log(
      //     "137 ===<> currentDate =>>",
      //     currentDate,
      //     "endDate =",
      //     endDate
      //   );
      //   while (currentDate <= endDate) {
      //     const ifDuplicate = currentDate.toISOString().slice(0, 10);
      //     if (dates.includes(ifDuplicate)) {
      //       console.log("--------YES DUPLICATES", ifDuplicate);
      //       res.send({ message: "alredy exist  date." });
      //     } else {
      //       res.send({ message1: "alredy exist  date." });
      //     }
      //     dates.push(ifDuplicate);
      //     currentDate.setDate(currentDate.getDate() + 1);
      //   }
      //   console.log("dates", dates);
      // }

      // if (dates.includes()) {
      //   res.send({ message: "alredy exist  date." });
      // }

      // for (let i = 0; i < user_data.length; i++) {
      //   let leave_from_date = user_data[i].from_date;
      //   let leave_to_date = user_data[i].to_date;
      //   console.log("132 ==> leave =>> leave_from_date =>>>", leave_from_date);
      //   console.log("133 ==> leave_to_date", leave_to_date);

      //   let leaveFrom = moment(leave_from_date, "YYYY-MM-DD");
      //   let leaveEnd = moment(leave_from_date, "YYYY-MM-DD");

      //   console.log(
      //     "137 ===<> leaveFrom =>>",
      //     leaveFrom,
      //     "leaveEnd =",
      //     leaveEnd
      //   );

      //   if(from_date)
      // }

      if (datelFind) {
        return res.send({ message: "alredy exist  date." });
      }
      // CHECK ALL FIELD IN FILL
      if (!leave_type || !userid || !to_date || !from_date || !reason_for_leave)
        return res.send({ message: "Please fill in all fields." });
      var today = "";
      if (leave_type == "full") {
        today = 1;
      } else {
        today = 0.5;
      }

      if (Number(from_date.split("-")[0]) % 4 == 0) {
        month_array[1] = "29";
      } else {
        month_array[1] = "28";
      }

      const month_intervals = getMonthIntervals(from_date, to_date);
      for (let i = 0; i < month_intervals.length; i++) {
        var holiday_1 = await HolidayModal.find({
          holiday_date: {
            $gte: month_intervals[i].start_date,
            $lte: month_intervals[i].end_date,
          },
        });

        var diff_between_leaves_days_1 =
          moment(month_intervals[i].end_date, "YYYY-MM-DD").diff(
            moment(month_intervals[i].start_date, "YYYY-MM-DD"),
            "days"
          ) + 1;

        var total_leave_1 =
          (diff_between_leaves_days_1 - holiday_1.length) * today;

        const leave_1 = new LeaveModal({
          userid,
          leave_type: today,
          from_date: month_intervals[i].start_date,
          to_date: month_intervals[i].end_date,
          reason_for_leave,
          total_number_of_day: total_leave_1,
          create_by: user_role === "HR" ? 1 : 0,
        });
        await leave_1.save();
      }
      res.status(200).send({ success: true });
      //Triger Email System
      sendLeaveMail(
        user_data.email,
        user_data.First_Name,
        from_date,
        to_date,
        reason_for_leave
      );
    } catch (error) {
      console.log(error);
      res.status(400).send({ status: false, error: error });
    }
  }

  async get_leave(req, res, next) {
    try {
      const docs = await LeaveModal.aggregate([
        {
          $lookup: {
            from: "empinfos", // collection original name it is default EmpInfo => empinfos
            localField: "userid",
            foreignField: "_id",
            as: "result",
          },
        },
      ]).sort({ _id: -1 });
      res.status(200).send({ msg: docs });
    } catch (err) {
      res.send({ error: err });
    }
  }

  async get_leave_today(req, res, next) {
    try {
      var today = moment(moment().utc().format("YYYY-MM-DD"));
      const convertedDate = today
        .add("day")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      // return
      const inputDate = new Date(convertedDate);
      const outputDate = new Date(
        Date.UTC(
          inputDate.getFullYear(),
          inputDate.getMonth(),
          inputDate.getDate()
        )
      ).toISOString();
      var from_date =
        String(today.year()) + "-" + String(today.month() + 1) + "-01";
      var to_date =
        String(today.year()) + "-" + String(today.month() + 1) + "-31";
      // var today = moment().subtract('day').format('YYYY-MM-DD');
      const findLeave = await LeaveModal.find({
        from_date_: { $gte: from_date, $lte: to_date },
        to_date_: { $gte: from_date, $lte: to_date },
      });
      console.log("findLeave", findLeave);
      return;
      for (var i = 0; i < findLeave.length; i++) {
        var docs = await LeaveModal.aggregate([
          {
            $match: {
              outputDate: {
                $gte: new Date(findLeave[i].from_date),
                $lte: new Date(findLeave[i].to_date),
              },
            },
          },
          {
            $lookup: {
              from: "empinfos", // collection original name it is default EmpInfo => empinfos
              localField: "userid",
              foreignField: "_id",
              as: "result",
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ]);
      }
      console.log("docs--", docs);
      return;
      res.send({ msg: docs });
    } catch (err) {
      res.send({ error: err });
      console.log(err);
    }
  }

  async get_yesterday_leave_(req, res, next) {
    try {
      var today = moment(moment().utc().format("YYYY-MM-DD"));
      var yesterday = moment(moment().utc().subtract(1, "days")).format(
        "YYYY-MM-DD"
      );
      yesterday = moment(new Date(yesterday).toISOString());
      var from_date =
        String(yesterday.year()) + "-" + String(yesterday.month() + 1) + "-01";
      var to_date =
        String(yesterday.year()) + "-" + String(yesterday.month() + 1) + "-31";
      const findLeave = await LeaveModal.find({
        from_date_: { $gte: from_date, $lte: to_date },
        to_date_: { $gte: from_date, $lte: to_date },
      });

      for (var i = 0; i < findLeave.length; i++) {
        var docs = await LeaveModal.aggregate([
          {
            $match: {
              $or: [
                {
                  from_date: {
                    $gte: new Date(findLeave[i].from_date),
                    $lte: new Date(findLeave[i].to_date),
                  },
                },
                {
                  to_date: {
                    $gte: new Date(findLeave[i].from_date),
                    $lte: new Date(findLeave[i].to_date),
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "empinfos", // collection original name it is default name of EmpInfo => empinfos
              localField: "userid",
              foreignField: "_id",
              as: "result",
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ]);
      }
      res.send({ msg: docs });
      console.log("docs--", docs);
    } catch (err) {
      res.send({ error: err });
      console.log(err);
    }
  }

  async update_laeve(req, res) {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }
    const id = req.params.id;
    LeaveModal.findByIdAndUpdate(id, req.body)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update =${id}`,
          });
          // if (req.body.leave_status) {
          //   sendVerificationMail();
          // }
        } else {
          replayMail(req.body.user_id, req.body.leave_status);
          res.status(200).send({ message: "updated successfully." });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating=" + id,
          err,
        });
        console.log(err);
      });
  }

  async leave_delete(req, res) {
    try {
      const userDelete = await LeaveModal.findByIdAndDelete(req.params.id);
      if (!userDelete) {
        return res.status(404).send({ message: "This user not Exist." });
      }
      res.status(201).json({ message: "delete successfuly" });
      console.log({ userDelete });
    } catch (error) {
      res.send({ error });
    }
  }

  async get_user_leave_id(req, res) {
    const userid = req.params.id;

    const datelFind = await LeaveModal.find({
      userid: userid,
    });
    if (!datelFind) {
      return res.status(404).send({ message: "This user not Exist." });
    }
    res.send(datelFind);
    console.log({ datelFind });
  }

  async get_User_leave(req, res, next) {
    try {
      const findLeave = await LeaveModal.find({
        userid: req.query.id,
        from_date: { $gte: req.query.from_date, $lte: req.query.to_date },
        to_date: { $gte: req.query.from_date, $lte: req.query.to_date },
      });
      res.send({ findLeave });
    } catch (err) {
      res.send({ error: err });
    }
  }

  async get_User_leave_count(req, res, next) {
    const findLeave = await LeaveModal.find({
      userid: req.query.id,
      from_date: { $gte: req.query.from_date, $lte: req.query.to_date },
      to_date: { $gte: req.query.from_date, $lte: req.query.to_date },
    });
    var leave_count = 0;
    for (let i = 0; i < findLeave.length; i++) {
      leave_count += findLeave[i].total_number_of_day;
    }
    res.send({ leave_count: leave_count });
  }

  async get_today_leave(req, res, next) {
    var today = moment(moment().utc().format("YYYY-MM-DD"));
    // var today = moment('2023-02-21', 'YYYY-MM-DD')  // for testing purpose
    var from_date =
      String(today.year()) + "-" + String(today.month() + 1) + "-01";
    var to_date =
      String(today.year()) + "-" + String(today.month() + 1) + "-31";

    try {
      const findLeave = await LeaveModal.find({
        from_date: { $gte: from_date, $lte: to_date },
        to_date: { $gte: from_date, $lte: to_date },
      });
      const emp_count = await EmpInfoModal.find({ is_active: 1 });
      var absent_count = 0;
      var employee = [];
      console.log("findLeave.length", findLeave.length);

      for (let i = 0; i < findLeave.length; i++) {
        var leaveId = findLeave[i]._id;

        var from_date_ = moment(
          moment(findLeave[i].from_date).utc().format("YYYY-MM-DD")
        );
        var to_date_ = moment(
          moment(findLeave[i].to_date).utc().format("YYYY-MM-DD")
        );
        if (today.isSameOrBefore(to_date_) && today.isSameOrAfter(from_date_)) {
          absent_count++;
          var docs = await LeaveModal.aggregate([
            {
              $match: {
                _id: leaveId,
              },
            },
            {
              $lookup: {
                from: "empinfos", // collection original name it is default name of EmpInfo => empinfos
                localField: "userid",
                foreignField: "_id",
                as: "result",
              },
            },
          ]).sort({ _id: -1 });
          employee.push(docs[0]);
        }
      }

      var present_count = emp_count.length - absent_count;
      if (present_count == 0 && absent_count == 0) {
        res.send({ message: "No records found" });
      } else {
        res.send({
          present_count: present_count,
          absent_count: absent_count,
          employe: employee,
        });
      }
    } catch (err) {
      res.send({ error: err });
    }
  }

  async get_yesterday_leave(req, res, next) {
    var today = moment(moment().utc().format("YYYY-MM-DD"));
    var yesterday = today.subtract(1, "day");
    var from_date =
      String(yesterday.year()) + "-" + String(yesterday.month() + 1) + "-01";
    var to_date =
      String(yesterday.year()) + "-" + String(yesterday.month() + 1) + "-31";
    console.log("from_date", from_date, "to_date", to_date);

    try {
      const findLeave = await LeaveModal.find({
        from_date: { $gte: from_date, $lte: to_date },
        to_date: { $gte: from_date, $lte: to_date },
      });
      const emp_count = await EmpInfoModal.find({ is_active: 1 });
      var absent_count = 0;
      var employee = [];
      console.log("findLeave.length", findLeave.length);

      for (let i = 0; i < findLeave.length; i++) {
        var leaveId = findLeave[i]._id;

        var from_date_ = moment(
          moment(findLeave[i].from_date).utc().format("YYYY-MM-DD")
        );
        var to_date_ = moment(
          moment(findLeave[i].to_date).utc().format("YYYY-MM-DD")
        );
        if (
          yesterday.isSameOrBefore(to_date_) &&
          yesterday.isSameOrAfter(from_date_)
        ) {
          absent_count++;
          var docs = await LeaveModal.aggregate([
            {
              $match: {
                _id: leaveId,
              },
            },
            {
              $lookup: {
                from: "empinfos", // collection original name it is default name of EmpInfo => empinfos
                localField: "userid",
                foreignField: "_id",
                as: "result",
              },
            },
          ]).sort({ _id: -1 });
          employee.push(docs[0]);
        }
      }

      var present_count = emp_count.length - absent_count;
      if (present_count == 0 && absent_count == 0) {
        res.send({ message: "No records found" });
      } else {
        res.send({
          present_count: present_count,
          absent_count: absent_count,
          employe: employee,
        });
      }
    } catch (err) {
      res.send({ error: err });
    }
  }
}

module.exports = new Leave();
