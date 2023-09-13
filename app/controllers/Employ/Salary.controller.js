"use strict";
const express = require("express");
const SalaryModal = require("../../models/Employ/Salary.modal");
const EmpInfoModal = require("../../models/Employ/Employ.model");
const HolidayModal = require("../../models/Employ/Holiday.modal");
const LeaveModal = require("../../models/Employ/leave.modal");
const yearModal = require("../../models/Employ/Year_Leave.modal");
const ObjectId = require("mongodb").ObjectId;
const sendVerificationMail = require("./mail");
const moment = require("moment");
let convertRupeesIntoWords = require("convert-rupees-into-words");

const month_array = [
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

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

class Salary {
  async get_salary(req, res, next) {
    try {
      yearModal
        .findOne({ year: req.query.year })
        .then(function (leave) {
          res.send(leave);
        })
        .catch(next);
    } catch (err) {
      res.send({ error: err });
    }
  }

  async get_allEmp_salary(req, res) {
    try {
      const { month, year } = req.body;
      SalaryModal.find({
        Salary_Slip_Year: year,
        Salary_Slip_Month: month,
      }).then((response) => {
        res.status(200).send(response);
      });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async salary_(req, res, next) {
    try {
      const year = req.query.year;
      const userid = req.query.userid;
      const month = req.query.month;
      const arrear_effective_date = 0;

      console.log("78 >>>", { year: year, userid: userid, month: month });

      if (!userid || !year || !month) {
        return res.send({ message: "Please fill in all fields." });
      }

      const Salary_Modal = await SalaryModal.find({
        userid: userid,
        Salary_Slip_Year: year,
        Salary_Slip_Month: month,
      });

      console.log("Found Salary Modal 90: >>>>>>", Salary_Modal);

      if (Salary_Modal.length !== 0 && !req.body.overwrite_payslip) {
        console.log(
          "94 >>> Salary_Modal.length !== 0 && !req.body.overwrite_payslip => true "
        );
        return res.status(200).send({ success: true, salary: Salary_Modal[0] });
      }

      const compareDates = (year, month, effective_date_emp) => {
        let month_flag = Number(month) < 10 ? "0" : "";
        let to_match_date =
          year +
          "-" +
          month_flag +
          month +
          "-" +
          effective_date_emp.toString().slice(8, 10);
        const effectiveDate = new Date(effective_date_emp);
        const toMatchDate = new Date(`${to_match_date}T00:00:00.000Z`);
        console.log(
          "97 >>>",
          "effectiveDate, toMatchDate >>>>",
          effectiveDate,
          toMatchDate
        );
        if (toMatchDate <= effectiveDate) {
          return "before";
        } else {
          return "after";
        }
      };

      console.log("123 >>compareDates >>>", compareDates);

      let empinfo_modal = await EmpInfoModal.find({
        _id: req.query.userid,
      });
      console.log("128 >> empinfo_modal >>>", empinfo_modal);

      empinfo_modal = empinfo_modal[0];
      const pathname =
        empinfo_modal.First_Name +
        " " +
        empinfo_modal.Last_Name +
        "_" +
        monthNames[Number(month) - 1];

      console.log(
        "139 >> empinfo_modal >>>>>>>>>>>",
        empinfo_modal.First_Name +
          " " +
          empinfo_modal.Last_Name +
          "_" +
          monthNames[Number(month) - 1]
      );

      let email = empinfo_modal.email;
      // sendVerificationMail(email, pathname)
      // return
      let effective_date_emp = empinfo_modal.base_salary_list;

      if (
        (Salary_Modal.length !== 0 && req.body.overwrite_payslip) ||
        Salary_Modal.length === 0
      ) {
        console.log(
          "157 >> (Salary_Modal.length !== 0 && req.body.overwrite_payslip) || Salary_Modal.length === 0 is true"
        );
        if (empinfo_modal.base_salary_list.length === 1) {
          console.log(
            "161 >> empinfo_modal.base_salary_list.length === 1 is true >>>"
          );
          let emp_leave_taken = 0;
          let emp_leave_taken_1 = 0;
          let effective_date_1 =
            empinfo_modal.base_salary_list[0].effective_date;

          const holiday_modal = await HolidayModal.find({
            holiday_date: {
              $gte: new Date(req.query.year, req.query.month - 1, 1),
              $lte: new Date(
                req.query.year,
                req.query.month - 1,
                month_array[Number(req.query.month) - 1],
                23,
                59,
                59
              ),
            },
          });
          console.log("holiday_modal 167 >>>", holiday_modal);
          const holiday_modal_1 = await HolidayModal.find({
            holiday_date: {
              $gte: effective_date_1,
              $lte: new Date(
                req.query.year,
                req.query.month - 1,
                month_array[Number(req.query.month) - 1],
                23,
                59,
                59
              ),
            },
          });
          console.log("holiday_modal_1 181 >>> ", holiday_modal_1);
          const leave_modal_1 = await LeaveModal.find({
            userid: req.query.userid,
            from_date: {
              $gte: effective_date_1,
              $lte: new Date(
                req.query.year,
                req.query.month - 1,
                month_array[Number(req.query.month) - 1],
                23,
                59,
                59
              ),
            },
            to_date: {
              $gte: effective_date_1,
              $lte: new Date(
                req.query.year,
                req.query.month - 1,
                month_array[Number(req.query.month) - 1],
                23,
                59,
                59
              ),
            },
          });
          console.log("leave_modal_1 207 >>> ", leave_modal_1);
          const leave_modal = await LeaveModal.find({
            userid: req.query.userid,
            from_date: {
              $gte: req.query.year + "-" + req.query.month + "-01",
              $lte: new Date(
                req.query.year,
                req.query.month - 1,
                month_array[Number(req.query.month) - 1],
                23,
                59,
                59
              ),
            },
            to_date: {
              $gte: req.query.year + "-" + req.query.month + "-01",
              $lte: new Date(
                req.query.year,
                req.query.month - 1,
                month_array[Number(req.query.month) - 1],
                23,
                59,
                59
              ),
            },
          });
          console.log("leave_modal 233 >>> ", leave_modal);

          for (let i = 0; i < leave_modal.length; i++) {
            emp_leave_taken += leave_modal[i].total_number_of_day;
          }

          for (let i = 0; i < leave_modal_1.length; i++) {
            emp_leave_taken_1 += leave_modal_1[i].total_number_of_day;
          }

          console.log("emp_leave_taken_1 243 >>>", emp_leave_taken_1);

          const date_effective = new Date(effective_date_1);
          const year_effective = date_effective.getFullYear();
          const month_effective = date_effective.getMonth();
          const lastDayOfMonth = new Date(
            year_effective,
            month_effective + 1,
            0
          );
          const daysUntilLastDayOfMonth =
            lastDayOfMonth.getDate() - date_effective.getDate() + 1;

          console.log("256 >>>", {
            date_effective: date_effective,
            year_effective: year_effective,
            month_effective: month_effective,
            lastDayOfMonth: lastDayOfMonth,
          });

          let leave_balence_year; //Default month leave
          let present_days;

          console.log(
            "280 >> year ",
            typeof parseInt(year),
            "month",
            typeof parseInt(month),
            typeof month_effective,
            typeof year_effective
          );

          console.log(
            "289 >>",
            month_effective + 1 === parseInt(month) &&
              year_effective === parseInt(year)
          );

          if (
            month_effective + 1 === parseInt(month) &&
            year_effective === parseInt(year)
          ) {
            console.log(
              "267 >> month_effective + 1 === month && year_effective === year >>> is true"
            );
            if (moment(empinfo_modal.date_of_joining).date() > 15) {
              console.log(
                "271 >> mpinfo_modal.date_of_joining).date() > 15 is true"
              );
              leave_balence_year = 0;
            }

            let working_days =
              Number(daysUntilLastDayOfMonth) - holiday_modal_1.length;

            present_days = working_days - emp_leave_taken_1;

            console.log(
              "working_days 283 >>>",
              working_days,
              "present_days 285 >>>",
              present_days,
              "emp_leave_taken_1 287 >>>",
              emp_leave_taken_1
            );
          } else {
            console.log(
              "306 >> month_effective + 1 === month && year_effective === year >>> is false"
            );
            let working_days_1 =
              Number(month_array[Number(req.query.month) - 1]) -
              holiday_modal.length;

            present_days = working_days_1 - emp_leave_taken;
          }

          console.log("301 >>", {
            leave_balence_year: leave_balence_year,
            present_days: present_days,
          });

          if (present_days === 0) {
            console.log("307 >> present_days === 0 is true");
            leave_balence_year = 0;
          } else {
            console.log("310 >> present_days === 0 is false");
            var year_leave_ = await yearModal.findOne({ year: year });
            console.log("312 >>", "year_leave_", year_leave_);
            leave_balence_year = year_leave_ ? year_leave_.leave : 1; //** */
            console.log(
              `319 >>> year : ${year}, year_leave: ${year_leave_}, leave_balence_year: ${leave_balence_year}`
            );
          }

          var working_days =
            Number(month_array[Number(req.query.month) - 1]) -
            holiday_modal.length;
          var present_days_1 = working_days - emp_leave_taken;
          var balance_days = leave_balence_year - emp_leave_taken;
          total_paid_days = present_days + leave_balence_year;

          console.log(
            "working_days 359 >>>",
            working_days,
            "present_days_1 361 >>>",
            present_days_1,
            "balance_days 363 >>>",
            balance_days,
            "total_paid_days 365 >>>",
            total_paid_days,
            "leave_balence_year >>>",
            leave_balence_year,
            "emp_leave_taken >>>",
            emp_leave_taken
          );

          for (let i = 0; i < effective_date_emp.length; i++) {
            result = compareDates(
              year,
              month,
              effective_date_emp[i].effective_date
            );
            if (result === "before") {
              if (i === 0) {
                salary_emp = effective_date_emp[i].salary_;
              } else {
                salary_emp = effective_date_emp[i - 1].salary_;
              }
              break;
            } else {
              salary_emp = effective_date_emp[i].salary_;
            }
          }
          console.log("salary_emp 390 >>> ", salary_emp);

          var gross_basic_da = Math.round(salary_emp * 0.4);
          var gross_hra = Math.round((gross_basic_da * 40) / 100);
          var gross_ra = Math.round((gross_basic_da * 15) / 100);
          var gross_flexi_benifits = Math.round(
            salary_emp - gross_basic_da - gross_hra - gross_ra
          );
          var earned_basic_da = Math.round(
            (gross_basic_da / working_days) * total_paid_days
          );
          var earned_hra = Math.round(
            (gross_hra / working_days) * total_paid_days
          );
          var earned_ra = Math.round(
            (gross_ra / working_days) * total_paid_days
          );
          var earned_flexi_benifits = Math.round(
            (gross_flexi_benifits / working_days) * total_paid_days
          );

          console.log(
            "gross_basic_da 412 >>>",
            gross_basic_da,
            "gross_hra",
            gross_hra,
            "gross_ra",
            gross_ra,
            "gross_flexi_benifits",
            gross_flexi_benifits,
            "earned_basic_da",
            earned_basic_da,
            "earned_hra",
            earned_hra,
            "earned_ra",
            earned_ra,
            "earned_flexi_benifits",
            earned_flexi_benifits
          );

          const arrs =
            Number(req.body.arrear) +
            Number(arrear_effective_date) +
            Number(req.body.Bonus) +
            Number(req.body.ECSI);

          var net_pay_in_number =
            (salary_emp / working_days) * total_paid_days + arrs;

          net_pay_in_number = Math.round(net_pay_in_number);

          let total_earn = (salary_emp / working_days) * total_paid_days;

          total_earn = Math.round(total_earn);

          var net_pay_in_word = convertRupeesIntoWords(net_pay_in_number);

          console.log(
            "net_pay_in_number 356 >>>",
            net_pay_in_number,
            "total_earn >>>",
            total_earn,
            "net_pay_in_word >>>",
            net_pay_in_word
          );

          const salary = new SalaryModal({
            Employee_name:
              empinfo_modal.First_Name + " " + empinfo_modal.Last_Name,
            userid: empinfo_modal._id,
            Employee_code: empinfo_modal.Employee_Code,
            designation: empinfo_modal.Position,
            Salary_Slip_Month: req.query.month,
            Salary_Slip_Year: req.query.year,
            Date_of_Joining: empinfo_modal.date_of_joining,
            Bank_Account_Number: empinfo_modal.Bank_No,
            Bank_IFSC_Code: empinfo_modal.Bank_IFSC,
            Total_Work_Days: working_days,
            Leave_balence: leave_balence_year,
            Leave_taken: emp_leave_taken,
            Balence_days: balance_days,
            Present_day: present_days,
            Total_paid_day: total_paid_days,
            Gross_Basic_DA: gross_basic_da,
            Gross_HRA: gross_hra,
            Gross_RA: gross_ra,
            Gross_Flext_benefits: gross_flexi_benifits,
            Gross_total: salary_emp,
            Earned_Basic_DA: Math.round(earned_basic_da),
            Earned_HRA: Math.round(earned_hra),
            Earned_RA: Math.round(earned_ra),
            Earned_Flext_benefits: Math.round(earned_flexi_benifits),
            Total_earn: total_earn,
            Net_pay_in_number: net_pay_in_number,
            Net_pay_in_words: net_pay_in_word,
            ARRS: Number(req.body.arrear),
            Bonus: Number(req.body.Bonus),
            ECSI: Number(req.body.ECSI),
            Additional: arrs,
            ARRS_Comment: req.body.arrear_comment,
            Additional_Comment: req.body.additional_comment,
          });
          salary.save();
          return res.status(200).send({ success: true, salary: salary });
        } else {
          console.log(
            "496 >> empinfo_modal.base_salary_list.length === 1 is false"
          );
          var arr = [];
          for (let i = 0; i < effective_date_emp.length; i++) {
            if (arr.length === 0) {
              console.log("501 >> arr.length === 0 >>> true");
              if (
                moment(
                  empinfo_modal.base_salary_list[
                    empinfo_modal.base_salary_list.length - 1 - i
                  ].effective_date
                ).month() +
                  1 ===
                  Number(month) &&
                moment(
                  empinfo_modal.base_salary_list[
                    empinfo_modal.base_salary_list.length - 1 - i
                  ].effective_date
                ).year() === Number(year)
              ) {
                console.log("516 >>> true");
                var leave_balence_year = 0;
                var emp_leave_taken = 0;
                var leave_taken_1 = 0;
                var leave_taken_2 = 0;
                var working_days = 0;
                var working_days_1 = 0;
                var working_days_2 = 0;
                var working_days_effective = 0;
                var working_days_1 = 0;
                var working_days_2 = 0;
                var present_days = 0;
                var present_days_1 = 0;
                var present_days_2 = 0;
                var total_paid_days = 0;
                var salary_emp_1 = 0;
                var salary_emp_2 = 0;
                var result;
                var salary_emp = 0;
                var leave_2 = 0;
                var leave_1 = 0;
                var leave_taken_1 = 0;
                var leave_taken_2 = 0;

                var dateString =
                  empinfo_modal.base_salary_list[
                    empinfo_modal.base_salary_list.length - 1 - i
                  ].effective_date;

                const date = new Date(dateString);

                var effective_month = date.getMonth() + 1;

                const effectivr_year = date.getFullYear();

                var effective_day = date.getDate();

                console.log(
                  "effective_month 554 >>>",
                  effective_month,
                  "effective_day >>>",
                  effective_day,
                  "effectivr_year >>>",
                  effectivr_year
                );

                if (month == effective_month && year == effectivr_year) {
                  console.log(
                    "563 >> month == effective_month && year == effectivr_year is true"
                  );
                  let effective_day1 = date;
                  var effective_month = month; // July
                  var effectiveDateDay = effective_day;

                  const startDate1 = new Date(
                    new Date().getFullYear(),
                    effective_month - 1,
                    1
                  );

                  console.log("576 >> startDate1", startDate1);

                  const endDate1 = new Date(
                    new Date().getFullYear(),
                    effective_month - 1,
                    effectiveDateDay
                  );

                  console.log("584 >> endDate1", endDate1);

                  const startDate2 = new Date(
                    new Date().getFullYear(),
                    effective_month - 1,
                    effectiveDateDay + 1
                  );

                  console.log("584 >> startDate2", startDate2);

                  const endDate2 = new Date(
                    new Date().getFullYear(),
                    effective_month - 1,
                    new Date(new Date().getFullYear(), month, 0).getDate() + 1
                  );

                  console.log("600 >> endDate2, ", endDate2);

                  var total_month_day1 = Math.ceil(
                    (endDate1 - startDate1) / (1000 * 60 * 60 * 24)
                  );

                  console.log("606 >> total_month_day1", total_month_day1);

                  var total_month_day2 =
                    Math.ceil((endDate2 - startDate2) / (1000 * 60 * 60 * 24)) +
                    1;

                  console.log("612 >> total_month_day2", total_month_day2);
                }

                const inputYear = year;
                const inputMonth = month;
                const dateObj = new Date(inputYear, inputMonth - 1);
                const year1 = dateObj.getFullYear();
                const month1 = String(dateObj.getMonth() + 1).padStart(2, "0");
                const day = String(dateObj.getDate()).padStart(2, "0");
                const holiday_day_start = `${year1}-${month1}-${day}`;
                const dateObj1 = new Date(inputYear, inputMonth, 0);
                const year2 = dateObj1.getFullYear();
                const month2 = String(dateObj1.getMonth() + 1).padStart(2, "0");
                const day1 = String(dateObj1.getDate()).padStart(2, "0");
                const holiday_day_end = `${year2}-${month2}-${day1}`;

                console.log("628 >>>", {
                  inputYear: inputYear,
                  inputMonth: inputMonth,
                  dateObj: dateObj,
                  year1: year1,
                  month1: month1,
                  day: day,
                  holiday_day_start: holiday_day_start,
                  dateObj1: dateObj1,
                  year2: year2,
                  month2: month2,
                  day1: day1,
                  holiday_day_end: holiday_day_end,
                });

                const lastEffectiveDate = moment(
                  empinfo_modal.base_salary_list[
                    empinfo_modal.base_salary_list.length - 1 - i
                  ].effective_date
                );
                var formattedLastEffectiveDate =
                  lastEffectiveDate.format("YYYY-MM-DD");
                console.log(
                  "650 >> formattedLastEffectiveDate >>>",
                  formattedLastEffectiveDate
                );

                var holiday_leave_1 = await HolidayModal.find({
                  holiday_date: {
                    $gte: holiday_day_start,
                    $lte: formattedLastEffectiveDate,
                    $ne: formattedLastEffectiveDate,
                  },
                });

                var holiday_leave_2 = await HolidayModal.find({
                  holiday_date: {
                    $gte: formattedLastEffectiveDate,
                    $lte: holiday_day_end,
                  },
                });

                var leave_day1 = await LeaveModal.find({
                  userid: req.query.userid,
                  from_date: {
                    $gte: req.query.year + "-" + req.query.month + "-01",
                    $lte: formattedLastEffectiveDate,
                  },
                  to_date: {
                    $gte: req.query.year + "-" + req.query.month + "-01",
                    $lt: formattedLastEffectiveDate,
                  },
                });

                var leave_day2 = await LeaveModal.find({
                  userid: req.query.userid,
                  from_date: {
                    $gte: formattedLastEffectiveDate,
                    $lt: holiday_day_end,
                  },
                  to_date: {
                    $gte: formattedLastEffectiveDate,
                    $lte: holiday_day_end,
                  },
                });

                const leave_modal = await LeaveModal.find({
                  userid: req.query.userid,
                  from_date: {
                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                    $lte: new Date(
                      req.query.year,
                      req.query.month - 1,
                      month_array[Number(req.query.month) - 1],
                      23,
                      59,
                      59
                    ),
                  },
                  to_date: {
                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                    $lte: new Date(
                      req.query.year,
                      req.query.month - 1,
                      month_array[Number(req.query.month) - 1],
                      23,
                      59,
                      59
                    ),
                  },
                });

                console.log(
                  "holiday_leave_1 718 >>>",
                  holiday_leave_1,
                  "holiday_leave_2 >>>",
                  holiday_leave_2,
                  "leave_day1 >>>",
                  leave_day1,
                  "leave_day2 >>>",
                  leave_day2,
                  "leave_modal >>>",
                  leave_modal
                );

                var holiday_modal =
                  Number(holiday_leave_1.length) +
                  Number(holiday_leave_2.length);

                console.log("holiday_modal 734 >>>", holiday_modal);

                if (leave_modal.length == 1) {
                  console.log("740 >> leave_modal.length == 1 >>> true");
                  var from_date1 = leave_modal[0].from_date;
                  var to_date1 = leave_modal[0].to_date;
                  console.log(
                    "743 >> from_date1",
                    from_date1,
                    "to_date1",
                    to_date1
                  );

                  const fromDate = new Date(from_date1);
                  const toDate = new Date(to_date1);
                  const effectiveDate = new Date(formattedLastEffectiveDate);

                  console.log(
                    "fromDate 754 >>>",
                    fromDate,
                    "toDate >>>",
                    toDate,
                    "effectiveDate >>>",
                    effectiveDate
                  );

                  if (effectiveDate >= fromDate && effectiveDate <= toDate) {
                    console.log(
                      "676 >>>",
                      "Effective date is between from date and to date"
                    );

                    if (leave_modal != 0) {
                      console.log("leave_modal", leave_modal);
                      var holiday_leave_3 = await HolidayModal.find({
                        holiday_date: {
                          $gte: formattedLastEffectiveDate,
                          $lte: toDate,
                        },
                      });
                      console.log("holiday_leave_3 689 >>>", holiday_leave_3);

                      var holiday_leave_4 = await HolidayModal.find({
                        holiday_date: {
                          $gte: fromDate,
                          $lte: formattedLastEffectiveDate,
                          $ne: formattedLastEffectiveDate,
                        },
                      });
                      console.log("holiday_leave_4 698 >>>", holiday_leave_4);

                      const effectiveDate = new Date(
                        "2023-03-06T00:00:00.000Z"
                      );
                      var part1_leave = {
                        fromDate: fromDate.toISOString(),
                        toDate: new Date(
                          effectiveDate.getTime() - 1
                        ).toISOString(),
                      };
                      console.log("part1_leave 707 >>>", part1_leave);

                      // Second part: toDate to effectiveDate
                      var part2_leave = {
                        fromDate: effectiveDate.toISOString(),
                        toDate: toDate.toISOString(),
                      };
                      console.log("714 >> Part 2 >>>", part2_leave);

                      const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

                      // Calculate the number of days in each part
                      var totalDaysPart1 = Math.round(
                        (new Date(part1_leave.toDate).getTime() -
                          new Date(part1_leave.fromDate).getTime()) /
                          millisecondsPerDay
                      );
                      console.log("724 >> Part 1 >>>", totalDaysPart1, "days");

                      var totalDaysPart2 = Math.round(
                        (new Date(part2_leave.toDate).getTime() -
                          new Date(part2_leave.fromDate).getTime()) /
                          millisecondsPerDay +
                          1
                      );
                      console.log("732 >> Part 2 >>>", totalDaysPart2, "days");

                      console.log(
                        "735 >> holiday_leave_1.length >>>",
                        holiday_leave_4.length
                      );

                      if (leave_modal[0].leave_type == 0.5) {
                        totalDaysPart1 = totalDaysPart1 / 2;
                        totalDaysPart2 = totalDaysPart2 / 2;
                      }
                      totalDaysPart1 = totalDaysPart1 - holiday_leave_4.length;
                      totalDaysPart2 = totalDaysPart2 - holiday_leave_3.length;

                      console.log("746 >> totalDaysPart1 >>>", totalDaysPart1);
                      console.log("747 >> totalDaysPart2 >>>", totalDaysPart2);
                      // return
                      leave_taken_1 = totalDaysPart1;
                      leave_taken_2 = totalDaysPart2;
                      console.log("751 >> leave_taken_1 >>>", leave_taken_1);
                      console.log("752 >> leave_taken_2 >>>", leave_taken_2);
                    }
                  } else {
                    console.log("844 >> else");
                    for (let i = 0; i < leave_day1.length; i++) {
                      leave_taken_1 += leave_day1[i].total_number_of_day;
                    }

                    for (let i = 0; i < leave_day2.length; i++) {
                      leave_taken_2 += leave_day2[i].total_number_of_day;
                    }

                    console.log("853 >> leave_taken_1 >>>", leave_taken_1);
                    console.log("854 >> leave_taken_2 >>>", leave_taken_2);
                  }
                } else {
                  console.log("858 >> leave_modal.length == 1 >>> false");
                  for (let i = 0; i < leave_modal.length - 1; i++) {
                    emp_leave_taken += leave_modal[i].total_number_of_day;
                    var from_date1 = leave_modal[i].from_date;
                    var to_date1 = leave_modal[i].to_date;

                    const fromDate = new Date(from_date1);
                    const toDate = new Date(to_date1);

                    console.log(
                      "777 >>>",
                      "emp_leave_taken >>>",
                      emp_leave_taken,
                      "fromDate >>>",
                      fromDate,
                      "toDate >>>",
                      toDate
                    );

                    const effectiveDate = new Date(formattedLastEffectiveDate);
                    console.log("788 >> effectiveDate >>>", effectiveDate);

                    if (effectiveDate >= fromDate && effectiveDate <= toDate) {
                      console.log(
                        "792 >> Effective date is between from date and to date"
                      );
                      if (leave_modal != 0) {
                        console.log("795 >> leave_modal >>>", leave_modal);
                        var holiday_leave_3 = await HolidayModal.find({
                          holiday_date: {
                            $gte: formattedLastEffectiveDate,
                            $lte: toDate,
                          },
                        });
                        console.log(
                          "802 >> holiday_leave_3 >>>",
                          holiday_leave_3
                        );

                        var holiday_leave_4 = await HolidayModal.find({
                          holiday_date: {
                            $gte: fromDate,
                            $lte: formattedLastEffectiveDate,
                            $ne: formattedLastEffectiveDate,
                          },
                        });
                        console.log(
                          "814 >> holiday_leave_4 >>>",
                          holiday_leave_4
                        );

                        const effectiveDate = new Date(
                          "2023-03-06T00:00:00.000Z"
                        );
                        var part1_leave = {
                          fromDate: fromDate.toISOString(),
                          toDate: new Date(
                            effectiveDate.getTime() - 1
                          ).toISOString(),
                        };
                        console.log("826 >> part1_leave >>>", part1_leave);

                        // Second part: toDate to effectiveDate
                        var part2_leave = {
                          fromDate: effectiveDate.toISOString(),
                          toDate: toDate.toISOString(),
                        };
                        console.log("833 >> part2_leave >>>", part2_leave);

                        const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

                        // Calculate the number of days in each part
                        var totalDaysPart1 = Math.round(
                          (new Date(part1_leave.toDate).getTime() -
                            new Date(part1_leave.fromDate).getTime()) /
                            millisecondsPerDay
                        );
                        var totalDaysPart2 = Math.round(
                          (new Date(part2_leave.toDate).getTime() -
                            new Date(part2_leave.fromDate).getTime()) /
                            millisecondsPerDay +
                            1
                        );

                        console.log(
                          "850 >> Part 1 >>>:",
                          totalDaysPart1,
                          "days"
                        );
                        console.log(
                          "851 >> Part 2 >>>:",
                          totalDaysPart2,
                          "days"
                        );
                        console.log(
                          "81 >> holiday_leave_1.length >>>",
                          holiday_leave_4.length
                        );
                        console.log(
                          "864 >> holiday_leave_4 >>>",
                          holiday_leave_4
                        );

                        if (leave_modal[i].leave_type == 0.5) {
                          totalDaysPart1 = totalDaysPart1 / 2;
                          totalDaysPart2 = totalDaysPart2 / 2;
                          // totalDaysPart2 = totalDaysPart2 / u;
                        }

                        totalDaysPart1 =
                          totalDaysPart1 - holiday_leave_4.length;

                        totalDaysPart2 =
                          totalDaysPart2 - holiday_leave_3.length;

                        console.log(
                          "881 >> totalDaysPart1 >>>",
                          totalDaysPart1
                        );
                        console.log(
                          "882 >> totalDaysPart2 >>>",
                          totalDaysPart2
                        );
                        // return
                        leave_taken_1 = totalDaysPart1;
                        leave_taken_2 = totalDaysPart2;
                        console.log("892 >> leave_taken_1 >>>", leave_taken_1);
                        console.log("893 >> leave_taken_2 >>>", leave_taken_2);
                      }
                    } else {
                      console.log("896 >> else");

                      for (let i = 0; i < leave_day1.length; i++) {
                        leave_taken_1 += leave_day1[i].total_number_of_day;
                      }

                      for (let i = 0; i < leave_day2.length; i++) {
                        leave_taken_2 += leave_day2[i].total_number_of_day;
                      }

                      console.log("907 >> leave_taken_2 >>>", leave_taken_2);
                      console.log("907 >> leave_taken_1 >>>", leave_taken_1);
                    }
                  }
                }

                var year_leave_ = await yearModal.findOne({ year: year });
                console.log("1005 >> year_leave_ >>>", year_leave_);

                leave_balence_year = year_leave_?.leave; /**? */
                console.log(
                  "1008 >> leave_balence_year >>>",
                  leave_balence_year
                );

                working_days_2 = total_month_day2 - holiday_leave_2.length;
                present_days_2 = working_days_2 - leave_taken_2;

                console.log("1013 >> working_days_2 >>>", working_days_2);
                console.log("1014  >> present_days_2 >>>", present_days_2);
                // return

                const date_effective = new Date(dateString);
                const year_effective = date_effective.getFullYear();
                const month_effective = date_effective.getMonth();
                var date2 = new Date(date_effective);
                var day_date_effective = date2.getDate();
                const lastDayOfMonth = new Date(
                  year_effective,
                  month_effective + 1,
                  0
                );

                const daysUntilLastDayOfMonth =
                  lastDayOfMonth.getDate() - date_effective.getDate();

                console.log(
                  "1035 >> ",
                  "date_effective >>>",
                  date_effective,
                  "month_effective >>>",
                  month_effective,
                  "year_effective >>>",
                  year_effective,
                  "day_date_effective >>>",
                  day_date_effective,
                  "lastDayOfMonth >>>",
                  lastDayOfMonth,
                  "total_month_day1 >>>",
                  total_month_day1
                );

                const array = empinfo_modal.base_salary_list;
                console.log("956 >> array -> Base salary list >>>", array);

                const element =
                  empinfo_modal.base_salary_list[
                    empinfo_modal.base_salary_list.length - 1 - i
                  ];

                const index = array.indexOf(element);
                // if ((month_effective + 1) == month && year_effective == year) {
                //     working_days_1 = Number(daysUntilLastDayOfMonth) - holiday_leave_1.length
                //     present_days = working_days - leave_taken_1
                //     present_days_1 = (working_days_1 - leave_taken_1) + leave_balence_year
                //     console.log('present_days_1', present_days_1, working_days_1, daysUntilLastDayOfMonth);

                // }
                // else {
                working_days_1 = total_month_day1 - holiday_leave_1.length;
                // if()
                console.log(
                  "1070 >>",
                  "working_days_1 >>>",
                  working_days_1,
                  "daysUntilLastDayOfMonth >>>",
                  daysUntilLastDayOfMonth,
                  "date2 >>>",
                  date2
                );

                if (day_date_effective == 1) {
                  present_days_2 =
                    working_days_2 - leave_taken_2 + leave_balence_year;
                } else {
                  present_days_1 =
                    working_days_1 - leave_taken_1 + leave_balence_year;
                }

                working_days = working_days_1 + working_days_2;
                console.log(
                  "1089 >> working_days_1 >>>",
                  working_days_1,
                  "+",
                  "working_days_2 >>>",
                  working_days_2,
                  "=",
                  "working_days >>>",
                  working_days
                );

                if (
                  month_effective + 1 == month &&
                  year_effective == year &&
                  index == 0
                ) {
                  console.log(
                    "1104 >> month_effective + 1 == month && year_effective == year && index == 0 >>> true"
                  );
                  present_days_1 = 0;
                  working_days_1 = 0;
                  salary_emp_1 = empinfo_modal.base_salary_list[0].salary_;
                  salary_emp_2 = empinfo_modal.base_salary_list[0].salary_;
                  working_days =
                    Number(month_array[Number(req.query.month) - 1]) -
                    holiday_modal;
                }

                present_days =
                  present_days_1 + present_days_2 - leave_balence_year;
                console.log("1118 >> present days =  >>>", present_days);

                emp_leave_taken = leave_taken_1 + leave_taken_2;
                console.log("1121 >> emp_leave_taken >>", emp_leave_taken);
                var balance_days = leave_balence_year - emp_leave_taken;
                console.log("1123 >> balance days >>", balance_days);
                total_paid_days = present_days + leave_balence_year;
                console.log("1126 >> total_paid_days >>", total_paid_days);

                for (let i = 0; i < effective_date_emp.length; i++) {
                  if (index == 0) {
                    salary_emp_2 = salary_emp_1;
                  }
                  if (day_date_effective == 1) {
                    salary_emp = salary_emp_2;
                  }
                  result = compareDates(
                    year,
                    month,
                    effective_date_emp[i].effective_date
                  );
                  if (result == "before") {
                    if (i === 0) {
                      salary_emp = effective_date_emp[i].salary_;
                    } else {
                      salary_emp = effective_date_emp[i - 1].salary_;
                    }
                    break;
                  } else {
                    salary_emp = effective_date_emp[i].salary_;
                  }
                }

                if (index == 0) {
                  salary_emp_2 = salary_emp_1;
                }

                if (day_date_effective == 1) {
                  salary_emp = salary_emp_2;
                }

                console.log(
                  "1159 >> day_date_effective >>> ",
                  day_date_effective
                );

                if (empinfo_modal.base_salary_list.length === 1) {
                  console.log("1empluyt1");
                  salary_emp_1 = Number(
                    empinfo_modal.base_salary_list[
                      empinfo_modal.base_salary_list.length - 1
                    ].salary_
                  );
                  salary_emp_2 = 0;
                } else if (empinfo_modal.base_salary_list.length === 2) {
                  console.log("1157 >> employ2");
                  salary_emp_1 = Number(
                    empinfo_modal.base_salary_list[
                      empinfo_modal.base_salary_list.length - 2
                    ].salary_
                  );
                  salary_emp_2 = Number(
                    empinfo_modal.base_salary_list[
                      empinfo_modal.base_salary_list.length - 1
                    ].salary_
                  );
                } else {
                  for (let i = 1; i < effective_date_emp.length; i++) {
                    console.log(i, i - 1);
                    const date = new Date(effective_date_emp[i].effective_date);
                    console.log(date, "1172 >> ");
                    const effective_month = date.getMonth() + 1;
                    if (effective_month == month) {
                      console.log("true 1175 >>");
                      console.log(i, "effective_date_emp", i - 1, "1", i);
                      salary_emp_1 = Number(
                        empinfo_modal.base_salary_list[i - 1].salary_
                      );
                      salary_emp_2 = Number(
                        empinfo_modal.base_salary_list[i].salary_
                      );
                      break;
                    }
                  }
                }

                if (index == 0 && day_date_effective != 1) {
                  salary_emp_2 = salary_emp_1;
                  present_days = present_days_2;
                  present_days_2 = present_days_2 + leave_balence_year;
                  total_paid_days = present_days_2;
                }
                if (index == 0) {
                  salary_emp_2 = salary_emp_1;
                }
                if (day_date_effective == 1) {
                  salary_emp = salary_emp_2;
                  var gross_basic_da = Math.round(salary_emp_2 * 0.4);
                  var gross_hra = Math.round((gross_basic_da * 40) / 100);
                  var gross_ra = Math.round((gross_basic_da * 15) / 100);
                  var gross_flexi_benifits = Math.round(
                    salary_emp_2 - gross_basic_da - gross_hra - gross_ra
                  );
                } else {
                  gross_basic_da = Math.round(salary_emp_1 * 0.4);
                  var gross_hra = Math.round((gross_basic_da * 40) / 100);
                  var gross_ra = Math.round((gross_basic_da * 15) / 100);
                  var gross_flexi_benifits = Math.round(
                    salary_emp_1 - gross_basic_da - gross_hra - gross_ra
                  );
                }
                console.log(salary_emp_2, salary_emp, salary_emp_1);

                // var gross_basic_da = Math.round(salary_emp_1 / 2)
                var gross_basic_da = Math.round(salary_emp_1 * 0.4);
                console.log("1233 >> gross_basic_da >>", gross_basic_da);
                var gross_hra = Math.round((gross_basic_da * 40) / 100);
                console.log("1235 >> gross_hra >>", gross_hra);
                var gross_ra = Math.round((gross_basic_da * 15) / 100);
                console.log("1237 >> gross_ra >>", gross_ra);
                var gross_flexi_benifits = Math.round(
                  salary_emp_1 - gross_basic_da - gross_hra - gross_ra
                );
                console.log(
                  "1242 >> gross_flexi_benifits >>",
                  gross_flexi_benifits
                );

                var earned_basic_da = Math.round(
                  (gross_basic_da / working_days) * total_paid_days
                );
                console.log("1249 >> earned_basic_da >>>", earned_basic_da);
                var earned_hra = Math.round(
                  (gross_hra / working_days) * total_paid_days
                );
                console.log("1253 >> earned_hra >>", earned_hra);
                var earned_ra = Math.round(
                  (gross_ra / working_days) * total_paid_days
                );
                console.log("1257 >> earned_ra >> earned_ra >>> ", earned_ra);
                var earned_flexi_benifits = Math.round(
                  (gross_flexi_benifits / working_days) * total_paid_days
                );
                console.log(
                  "1261 >> earned_flexi_benifits >> ",
                  earned_flexi_benifits
                );
                var net_pay_in_number_1 =
                  (salary_emp_1 / working_days) * present_days_1;
                console.log(
                  "1264 >> net_pay_in_number_1 >> ",
                  net_pay_in_number_1
                );
                var net_pay_in_number_2 =
                  (salary_emp_2 / working_days) * present_days_2;
                console.log(
                  "1267 >> net_pay_in_number_2 >>",
                  net_pay_in_number_2
                );
                const arrs =
                  Number(req.body.arrear) +
                  Number(arrear_effective_date) +
                  Number(req.body.Bonus) +
                  Number(req.body.ECSI);
                console.log("1282 >> arrs >>> ", arrs);
                let total_earn = net_pay_in_number_1 + net_pay_in_number_2;
                console.log("1284 >> total_earn >>>", total_earn);
                total_earn = Math.round(total_earn);
                console.log("1286 >> total_earn >>>", total_earn);
                var net_pay_in_number =
                  net_pay_in_number_1 + net_pay_in_number_2 + arrs;
                console.log("1289 >> net_pay_in_number >> ", net_pay_in_number);
                net_pay_in_number = Math.round(net_pay_in_number);
                console.log("1291 >> net_pay_in_number >>", net_pay_in_number);
                var net_pay_in_word = convertRupeesIntoWords(net_pay_in_number);
                console.log("1293 >> net_pay_in_word", net_pay_in_word);

                const salary = new SalaryModal({
                  Employee_name:
                    empinfo_modal.First_Name + " " + empinfo_modal.Last_Name,
                  userid: empinfo_modal._id,
                  Employee_code: empinfo_modal.Employee_Code,
                  designation: empinfo_modal.Position,
                  Salary_Slip_Month: req.query.month,
                  Salary_Slip_Year: req.query.year,
                  Date_of_Joining: empinfo_modal.date_of_joining,
                  Bank_Account_Number: empinfo_modal.Bank_No,
                  Bank_IFSC_Code: empinfo_modal.Bsalary_emp_1ank_IFSC,
                  Total_Work_Days: working_days,
                  Leave_balence: leave_balence_year,
                  Leave_taken: emp_leave_taken,
                  Balence_days: balance_days,
                  Present_day: present_days,
                  Total_paid_day: total_paid_days,
                  Gross_Basic_DA: gross_basic_da,
                  Gross_HRA: gross_hra,
                  Gross_RA: gross_ra,
                  Gross_Flext_benefits: gross_flexi_benifits,
                  Gross_total: salary_emp,
                  Earned_Basic_DA: Math.round(earned_basic_da),
                  Earned_HRA: Math.round(earned_hra),
                  Earned_RA: Math.round(earned_ra),
                  Earned_Flext_benefits: Math.round(earned_flexi_benifits),
                  Total_earn: total_earn,
                  Net_pay_in_number: net_pay_in_number,
                  Net_pay_in_words: net_pay_in_word,
                  ARRS: Number(req.body.arrear),
                  Bonus: Number(req.body.Bonus),
                  ECSI: Number(req.body.ECSI),
                  Additional: arrs,
                  ARRS_Comment: req.body.arrear_comment,
                  Additional_Comment: req.body.additional_comment,
                });

                salary.save();
                arr.push(1);
                return res.status(200).send({ success: true, salary: salary });
              }
            }
          }

          for (var i = 0; i < effective_date_emp.length; i++) {
            if (arr.length === 0) {
              console.log("1304 >> arr.length === 0 is true");
              if (
                moment(
                  empinfo_modal.base_salary_list[
                    empinfo_modal.base_salary_list.length - 1 - i
                  ].effective_date
                ).month() +
                  1 !=
                  Number(month) ||
                moment(
                  empinfo_modal.base_salary_list[
                    empinfo_modal.base_salary_list.length - 1 - i
                  ].effective_date
                ).year() != Number(year)
              ) {
                console.log("1319 moment is true");

                const holiday_modal = await HolidayModal.find({
                  holiday_date: {
                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                    $lte: new Date(
                      req.query.year,
                      req.query.month - 1,
                      month_array[Number(req.query.month) - 1],
                      23,
                      59,
                      59
                    ),
                  },
                });
                console.log("1333 holiday_modal >>>", holiday_modal);

                var emp_leave_taken = 0;
                working_days =
                  Number(month_array[Number(req.query.month) - 1]) -
                  holiday_modal.length;

                const leave_modal = await LeaveModal.find({
                  userid: req.query.userid,
                  from_date: {
                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                    $lte: new Date(
                      req.query.year,
                      req.query.month - 1,
                      month_array[Number(req.query.month) - 1],
                      23,
                      59,
                      59
                    ),
                  },
                  to_date: {
                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                    $lte: new Date(
                      req.query.year,
                      req.query.month - 1,
                      month_array[Number(req.query.month) - 1],
                      23,
                      59,
                      59
                    ),
                  },
                });

                console.log("1365  leave_modal >>>", leave_modal);

                for (let i = 0; i < leave_modal?.length; i++) {
                  emp_leave_taken += leave_modal[i].total_number_of_day;
                }
                console.log("1370 emp_leave_taken >>>", emp_leave_taken);

                const compareDates = (year, month, effective_date_emp) => {
                  var month_flag = Number(month) < 10 ? "0" : "";
                  var to_match_date =
                    year +
                    "-" +
                    month_flag +
                    month +
                    "-" +
                    effective_date_emp.toString().slice(8, 10);
                  const effectiveDate = new Date(effective_date_emp);
                  const toMatchDate = new Date(
                    `${to_match_date}T00:00:00.000Z`
                  );

                  if (toMatchDate <= effectiveDate) {
                    return "before";
                  } else {
                    return "after";
                  }
                };

                present_days = working_days - emp_leave_taken;

                console.log(
                  "1395 >> present_days",
                  present_days,
                  "working_days",
                  working_days,
                  "emp_leave_taken",
                  emp_leave_taken
                );

                if (present_days === 0) {
                  console.log("1405 >> present_days === 0 is true");
                  leave_balence_year = 0;
                } else {
                  console.log("1408 >> present_days === 0 is false");
                  let year_leave_ = await yearModal.findOne({ year: year });
                  console.log("1410 >> year_leave_ >>>", year_leave_);
                  //leave_balence_year = year_leave_?.leave;

                  leave_balence_year = year_leave_ ? year_leave_.leave : 1;
                  console.log(
                    "1412 >> leave_balence_year >>>",
                    leave_balence_year
                  );
                }

                if (day_date_effective == 1) {
                  console.log(
                    "1419 >> day_date_effective is true >>>",
                    day_date_effective
                  );
                  salary_emp = effective_date_emp[i].salary_;
                }

                console.log("1426 >> salary_emp >>>", salary_emp);

                let balance_days = leave_balence_year - emp_leave_taken;
                console.log("1429 >> balance_days >>>", balance_days);

                total_paid_days = present_days + leave_balence_year;
                console.log("1432 >> total_paid_days", total_paid_days);

                for (let i = 0; i < effective_date_emp.length; i++) {
                  result = compareDates(
                    year,
                    month,
                    effective_date_emp[i].effective_date
                  );
                  if (result == "before") {
                    if (i === 0) {
                      salary_emp = effective_date_emp[i].salary_;
                    } else {
                      salary_emp = effective_date_emp[i - 1].salary_;
                    }
                    break;
                  } else {
                    salary_emp = effective_date_emp[i].salary_;
                  }
                }
                var gross_basic_da = Math.round(salary_emp * 0.4);
                var gross_hra = Math.round((gross_basic_da * 40) / 100);
                var gross_ra = Math.round((gross_basic_da * 15) / 100);
                var gross_flexi_benifits = Math.round(
                  salary_emp - gross_basic_da - gross_hra - gross_ra
                );
                var earned_basic_da = Math.round(
                  (gross_basic_da / working_days) * total_paid_days
                );
                var earned_hra = Math.round(
                  (gross_hra / working_days) * total_paid_days
                );
                var earned_ra = Math.round(
                  (gross_ra / working_days) * total_paid_days
                );
                var earned_flexi_benifits = Math.round(
                  (gross_flexi_benifits / working_days) * total_paid_days
                );

                const arrs =
                  Number(req.body.arrear) +
                  Number(arrear_effective_date) +
                  Number(req.body.Bonus) +
                  Number(req.body.ECSI);
                var net_pay_in_number =
                  (salary_emp / working_days) * total_paid_days + arrs;
                net_pay_in_number = Math.round(net_pay_in_number);
                let total_earn = (salary_emp / working_days) * total_paid_days;
                total_earn = Math.round(total_earn);
                var net_pay_in_word = convertRupeesIntoWords(net_pay_in_number);

                console.log(
                  "working_days 1412 >>>",
                  working_days,
                  "present_days_1 1412 >>>",
                  present_days,
                  "balance_days 1412 >>>",
                  balance_days,
                  "total_paid_days 1412 >>>",
                  total_paid_days,
                  "leave_balence_year >>>",
                  leave_balence_year,
                  "emp_leave_taken >>>",
                  emp_leave_taken
                );

                const salary = new SalaryModal({
                  Employee_name:
                    empinfo_modal.First_Name + " " + empinfo_modal.Last_Name,
                  userid: empinfo_modal._id,
                  Employee_code: empinfo_modal.Employee_Code,
                  designation: empinfo_modal.Position,
                  Salary_Slip_Month: req.query.month,
                  Salary_Slip_Year: req.query.year,
                  Date_of_Joining: empinfo_modal.date_of_joining,
                  Bank_Account_Number: empinfo_modal.Bank_No,
                  Bank_IFSC_Code: empinfo_modal.Bank_IFSC,
                  Total_Work_Days: working_days,
                  Leave_balence: leave_balence_year,
                  Leave_taken: emp_leave_taken,
                  Balence_days: balance_days,
                  Present_day: present_days,
                  Total_paid_day: total_paid_days,
                  Gross_Basic_DA: gross_basic_da,
                  Gross_HRA: gross_hra,
                  Gross_RA: gross_ra,
                  Gross_Flext_benefits: gross_flexi_benifits,
                  Gross_total: salary_emp,
                  Earned_Basic_DA: Math.round(earned_basic_da),
                  Earned_HRA: Math.round(earned_hra),
                  Earned_RA: Math.round(earned_ra),
                  Earned_Flext_benefits: Math.round(earned_flexi_benifits),
                  Total_earn: total_earn,
                  Net_pay_in_number: net_pay_in_number,
                  Net_pay_in_words: net_pay_in_word,
                  ARRS: Number(req.body.arrear),
                  Bonus: Number(req.body.Bonus),
                  ECSI: Number(req.body.ECSI),
                  Additional: arrs,
                  ARRS_Comment: req.body.arrear_comment,
                  Additional_Comment: req.body.additional_comment,
                });
                salary.save();
                arr.push(1);
                return res.status(200).send({ success: true, salary: salary });
              }
            }
          }
        }
      }
    } catch (err) {
      res.send({ error: err.message });
    }
  }
}
module.exports = new Salary();
