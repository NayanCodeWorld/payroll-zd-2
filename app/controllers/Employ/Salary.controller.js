"use strict";
const express = require("express");
const SalaryModal = require('../../models/Employ/Salary.modal')
const EmpInfoModal = require('../../models/Employ/Employ.model');
const HolidayModal = require('../../models/Employ/Holiday.modal')
const LeaveModal = require('../../models/Employ/leave.modal')
const yearModal = require('../../models/Employ/Year_Leave.modal')
const ObjectId = require("mongodb").ObjectId;
const moment = require('moment');
const { request } = require("express");
var convertRupeesIntoWords = require('convert-rupees-into-words');
var month_array = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
class Salary {

    async get_salary(req, res, next) {
        try {
            yearModal.findOne({ year: req.query.year })
                .then(function (leave) {
                    res.send(leave);
                }).catch(next);

        }
        catch (err) {
            res.send({ "error": err })
        }
    }

    async salary_(req, res, next) {
        const year = req.query.year;
        const userid = req.query.userid;
        const month = req.query.month
        const arrear_effective_date = 0

        if (!req.query.userid || !req.query.year || !req.query.month) {
            return res.send({ message: "Please fill in all fields." });
        }
        var Salary_Modal = await SalaryModal.find({
            userid: req.query.userid,
            Salary_Slip_Year: req.query.year,
            Salary_Slip_Month: req.query.month,
        })
        if (Salary_Modal.length != 0 && !req.body.overwrite_payslip) {
            console.log(Salary_Modal[0], '..................')
            return res.send(Salary_Modal[0])
        }
        const compareDates = (year, month, effective_date_emp) => {
            var month_flag = Number(month) < 10 ? "0" : ""
            var to_match_date = year + "-" + month_flag + month + "-" + effective_date_emp.toString().slice(8, 10);
            const effectiveDate = new Date(effective_date_emp);
            const toMatchDate = new Date(`${to_match_date}T00:00:00.000Z`);

            if (toMatchDate <= effectiveDate) {
                return "before";
            } else {
                return "after";
            }

        }
        var empinfo_modal = await EmpInfoModal.find({
            _id: req.query.userid
        })
        empinfo_modal = empinfo_modal[0]
        var effective_date_emp = empinfo_modal.base_salary_list

        if (Salary_Modal.length != 0 && req.body.overwrite_payslip || Salary_Modal.length == 0) {
            // return

            if (empinfo_modal.base_salary_list.length == 1) {
                var emp_leave_taken = 0
                var emp_leave_taken_1 = 0
                var effective_date_1 = empinfo_modal.base_salary_list[0].effective_date
                const holiday_modal = await HolidayModal.find({
                    holiday_date: {
                        $gte: new Date(req.query.year, req.query.month - 1, 1),
                        $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                    }

                });
                const holiday_modal_1 = await HolidayModal.find({
                    holiday_date: {
                        $gte: effective_date_1,
                        $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                    }

                });
                const leave_modal_1 = await LeaveModal.find({
                    userid: req.query.userid,
                    from_date: {
                        $gte: effective_date_1,
                        $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                    },
                    to_date: {
                        $gte: effective_date_1,
                        $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                    }
                });
                const leave_modal = await LeaveModal.find({
                    userid: req.query.userid,
                    from_date: {
                        $gte: req.query.year + "-" + req.query.month + '-01',
                        $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                    },
                    to_date: {
                        $gte: req.query.year + "-" + req.query.month + '-01',
                        $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                    }
                });

                for (let i = 0; i < leave_modal.length; i++) {
                    emp_leave_taken += leave_modal[i].total_number_of_day
                }

                for (let i = 0; i < leave_modal_1.length; i++) {
                    emp_leave_taken_1 += leave_modal_1[i].total_number_of_day
                }
                const date_effective = new Date(effective_date_1);
                const year_effective = date_effective.getFullYear();
                const month_effective = date_effective.getMonth();
                const lastDayOfMonth = new Date(year_effective, month_effective + 1, 0);
                const daysUntilLastDayOfMonth = lastDayOfMonth.getDate() - date_effective.getDate() + 1;

                if ((month_effective + 1) == month) {
                    if (moment(empinfo_modal.date_of_joining).date() > 15) {
                        leave_balence_year = 0
                    }
                    working_days = Number(daysUntilLastDayOfMonth) - holiday_modal_1.length
                    present_days = working_days - emp_leave_taken_1

                }
                else {

                    working_days = Number(month_array[Number(req.query.month) - 1]) - holiday_modal.length
                    present_days = working_days - emp_leave_taken

                }
                if (present_days === 0) {
                    leave_balence_year = 0
                }
                else {
                    var year_leave_ = await yearModal.findOne({ year: year })
                    leave_balence_year = year_leave_.leave


                }
                var present_days_1 = working_days_1 - emp_leave_taken
                var balance_days = leave_balence_year - emp_leave_taken
                total_paid_days = present_days + leave_balence_year;

                for (let i = 0; i < effective_date_emp.length; i++) {
                    result = compareDates(year, month, effective_date_emp[i].effective_date);
                    if (result == "before") {
                        if (i === 0) {
                            salary_emp = effective_date_emp[i].salary_
                        } else {
                            salary_emp = effective_date_emp[i - 1].salary_
                        }
                        break
                    } else {
                        salary_emp = effective_date_emp[i].salary_
                    }
                }
                var gross_basic_da = Math.round(salary_emp / 2)
                var gross_hra = Math.round((gross_basic_da * 40) / 100)
                var gross_ra = Math.round((gross_basic_da * 15) / 100)
                var gross_flexi_benifits = Math.round(salary_emp - gross_basic_da - gross_hra - gross_ra)
                var earned_basic_da = Math.round((gross_basic_da / working_days) * total_paid_days)
                var earned_hra = Math.round((gross_hra / working_days) * total_paid_days)
                var earned_ra = Math.round((gross_ra / working_days) * total_paid_days)
                var earned_flexi_benifits = Math.round((gross_flexi_benifits / working_days) * total_paid_days)
                var net_pay_in_number = (salary_emp / working_days) * total_paid_days
                // + Number(req.body.arrear) + Number(req.body.additional)
                net_pay_in_number = Math.round(net_pay_in_number)
                var net_pay_in_word = convertRupeesIntoWords(net_pay_in_number)

                const salary = new SalaryModal({
                    Employee_name: empinfo_modal.First_Name + " " + empinfo_modal.Last_Name,
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
                    Total_earn: net_pay_in_number,
                    Net_pay_in_number: net_pay_in_number,
                    Net_pay_in_words: net_pay_in_word,
                    ARRS: Number(req.body.arrear) + Number(arrear_effective_date),
                    Additional: Number(req.body.additional),
                    ARRS_Comment: req.body.arrear_comment,
                    Additional_Comment: req.body.additional_comment,

                });

                salary.save();
                return res.status(200).send({ success: true, 'salary': salary })

            }
            else {
                var arr = []
                for (var i = 1; i <= effective_date_emp.length; i++) {
                    console.log('3333333333333333333333333333333333', i);
                    if (arr.length == 0) {

                        if (moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date).month() + 1 == Number(month) && (moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date).year()) == Number(year)) {

                            var leave_balence_year = 0
                            var emp_leave_taken = 0
                            var leave_taken_1 = 0
                            var leave_taken_2 = 0
                            var working_days = 0
                            var working_days_1 = 0
                            var working_days_2 = 0
                            var working_days_effective = 0
                            var working_days_1 = 0
                            var working_days_2 = 0
                            var present_days = 0
                            var present_days_1 = 0
                            var present_days_2 = 0
                            var total_paid_days = 0
                            var salary_emp_1 = 0
                            var salary_emp_2 = 0
                            var result
                            var salary_emp = 0
                            var leave_2 = 0
                            var leave_1 = 0
                            var leave_taken_1 = 0
                            var leave_taken_2 = 0


                            var dateString = empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date
                            const date = new Date(dateString);
                            var effective_month = date.getMonth() + 1
                            const effectivr_year = date.getFullYear()
                            var effective_day = date.getDate()
                            if (month == effective_month && year == effectivr_year) {
                                let effective_day1 = date
                                // let effective_day1 =
                                var effective_month = month// July
                                var effectiveDateDay = effective_day
                                const startDate1 = new Date(new Date().getFullYear(), effective_month - 1, 1);
                                const endDate1 = new Date(new Date().getFullYear(), effective_month - 1, effectiveDateDay);
                                const startDate2 = new Date(new Date().getFullYear(), effective_month - 1, effectiveDateDay + 1);
                                const endDate2 = new Date(new Date().getFullYear(), effective_month - 1, new Date(new Date().getFullYear(), month, 0).getDate() + 1);
                                var total_month_day1 = Math.ceil((endDate1 - startDate1) / (1000 * 60 * 60 * 24));
                                var total_month_day2 = Math.ceil((endDate2 - startDate2) / (1000 * 60 * 60 * 24)) + 1;
                            }

                            const inputYear = year;
                            const inputMonth = month
                            const dateObj = new Date(inputYear, inputMonth - 1);
                            const year1 = dateObj.getFullYear();
                            const month1 = String(dateObj.getMonth() + 1).padStart(2, '0');
                            const day = String(dateObj.getDate()).padStart(2, '0');
                            const holiday_day_start = `${year1}-${month1}-${day}`;
                            const dateObj1 = new Date(inputYear, inputMonth, 0);
                            const year2 = dateObj1.getFullYear();
                            const month2 = String(dateObj1.getMonth() + 1).padStart(2, '0');
                            const day1 = String(dateObj1.getDate()).padStart(2, '0');
                            const holiday_day_end = `${year2}-${month2}-${day1}`;

                            const lastEffectiveDate = moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date);
                            var formattedLastEffectiveDate = lastEffectiveDate.format('YYYY-MM-DD');


                            var holiday_leave_1 = await HolidayModal.find({
                                holiday_date: {
                                    $gte: holiday_day_start,
                                    $lte: formattedLastEffectiveDate,
                                    $ne: formattedLastEffectiveDate
                                }

                            })
                            var holiday_leave_2 = await HolidayModal.find({
                                holiday_date: {
                                    $gte: formattedLastEffectiveDate,
                                    $lte: holiday_day_end

                                }

                            })
                            var leave_day1 = await LeaveModal.find({
                                userid: req.query.userid,
                                from_date: {
                                    $gte: req.query.year + "-" + req.query.month + '-01',
                                    $lte: formattedLastEffectiveDate
                                },
                                to_date: {
                                    $gte: req.query.year + "-" + req.query.month + '-01',
                                    $lt: formattedLastEffectiveDate
                                }
                            })
                            var leave_day2 = await LeaveModal.find({
                                userid: req.query.userid,
                                from_date: {
                                    $gte: formattedLastEffectiveDate,
                                    $lt: holiday_day_end
                                },
                                to_date: {
                                    $gte: formattedLastEffectiveDate,
                                    $lte: holiday_day_end
                                }
                            })
                            const leave_modal = await LeaveModal.find({
                                userid: req.query.userid,
                                from_date: {
                                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                                    $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                                },
                                to_date: {
                                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                                    $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                                }
                            });
                            var holiday_modal = Number(holiday_leave_1.length) + Number(holiday_leave_2.length)
                            if (leave_modal.length == 1) {
                                var from_date1 = leave_modal[0].from_date
                                var to_date1 = leave_modal[0].to_date
                                console.log('   from_date1', from_date1, 'to_date1', to_date1);

                                const fromDate = new Date(from_date1);
                                const toDate = new Date(to_date1)
                                const effectiveDate = new Date(formattedLastEffectiveDate);

                                if (effectiveDate >= fromDate && effectiveDate <= toDate) {
                                    console.log('Effective date is between from date and to date'); if (leave_modal != 0) {
                                        console.log('leave_modal', leave_modal);
                                        var holiday_leave_3 = await HolidayModal.find({
                                            holiday_date: {
                                                $gte: formattedLastEffectiveDate,
                                                $lte: toDate
                                            }
                                        })
                                        var holiday_leave_4 = await HolidayModal.find({
                                            holiday_date: {
                                                $gte: fromDate,
                                                $lte: formattedLastEffectiveDate,
                                                $ne: formattedLastEffectiveDate
                                            }
                                        })
                                        // const effectiveDate = new Date('2023-03-06T00:00:00.000Z');
                                        var part1_leave = {
                                            fromDate: fromDate.toISOString(),
                                            toDate: new Date(effectiveDate.getTime() - 1).toISOString(),
                                        };

                                        // Second part: toDate to effectiveDate
                                        var part2_leave = {
                                            fromDate: effectiveDate.toISOString(),
                                            toDate: toDate.toISOString(),
                                        };

                                        console.log('Part 1:', part1_leave);
                                        console.log('Part 2:', part2_leave);

                                        const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

                                        // Calculate the number of days in each part
                                        var totalDaysPart1 = Math.round((new Date(part1_leave.toDate).getTime() - new Date(part1_leave.fromDate).getTime()) / millisecondsPerDay);
                                        var totalDaysPart2 = Math.round((new Date(part2_leave.toDate).getTime() - new Date(part2_leave.fromDate).getTime()) / millisecondsPerDay + 1);

                                        console.log('Part 1:', totalDaysPart1, 'days');
                                        console.log('Part 2:', totalDaysPart2, 'days');
                                        console.log(holiday_leave_4.length, 'holiday_leave_1.length');
                                        console.log('holiday_leave_1', holiday_leave_4);
                                        totalDaysPart1 = totalDaysPart1 - holiday_leave_4.length
                                        totalDaysPart2 = totalDaysPart2 - holiday_leave_3.length
                                        console.log('totalDaysPart1', totalDaysPart1);
                                        console.log('totalDaysPart2', totalDaysPart2);
                                        // return
                                        leave_taken_1 = totalDaysPart1
                                        leave_taken_2 = totalDaysPart2
                                        console.log('leave_taken_2111111111111', leave_taken_2);

                                    }
                                    console.log('leave_taken_2333333333333333', leave_taken_2);

                                }

                                else {
                                    console.log('else');
                                    for (let i = 0; i < leave_day1.length; i++) {
                                        leave_taken_1 += leave_day1[i].total_number_of_day
                                    }

                                    for (let i = 0; i < leave_day2.length; i++) {
                                        leave_taken_2 += leave_day2[i].total_number_of_day
                                    }
                                    console.log('leave_taken_24444444444444', leave_taken_2);
                                    console.log('leave_taken_13456789', leave_taken_1);
                                }
                            }
                            else {
                                for (let i = 0; i < leave_modal.length - 1; i++) {
                                    emp_leave_taken += leave_modal[i].total_number_of_day
                                    var from_date1 = leave_modal[i].from_date
                                    var to_date1 = leave_modal[i].to_date

                                    const fromDate = new Date(from_date1);
                                    const toDate = new Date(to_date1);
                                    const effectiveDate = new Date(formattedLastEffectiveDate);
                                    if (effectiveDate >= fromDate && effectiveDate <= toDate) {
                                        console.log('Effective date is between from date and to date'); if (leave_modal != 0) {
                                            console.log('leave_modal', leave_modal);
                                            var holiday_leave_3 = await HolidayModal.find({
                                                holiday_date: {
                                                    $gte: formattedLastEffectiveDate,
                                                    $lte: toDate
                                                }
                                            })
                                            var holiday_leave_4 = await HolidayModal.find({
                                                holiday_date: {
                                                    $gte: fromDate,
                                                    $lte: formattedLastEffectiveDate,
                                                    $ne: formattedLastEffectiveDate
                                                }
                                            })
                                            // const effectiveDate = new Date('2023-03-06T00:00:00.000Z');
                                            var part1_leave = {
                                                fromDate: fromDate.toISOString(),
                                                toDate: new Date(effectiveDate.getTime() - 1).toISOString(),
                                            };

                                            // Second part: toDate to effectiveDate
                                            var part2_leave = {
                                                fromDate: effectiveDate.toISOString(),
                                                toDate: toDate.toISOString(),
                                            };

                                            console.log('Part 1:', part1_leave);
                                            console.log('Part 2:', part2_leave);

                                            const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

                                            // Calculate the number of days in each part
                                            var totalDaysPart1 = Math.round((new Date(part1_leave.toDate).getTime() - new Date(part1_leave.fromDate).getTime()) / millisecondsPerDay);
                                            var totalDaysPart2 = Math.round((new Date(part2_leave.toDate).getTime() - new Date(part2_leave.fromDate).getTime()) / millisecondsPerDay + 1);

                                            console.log('Part 1:', totalDaysPart1, 'days');
                                            console.log('Part 2:', totalDaysPart2, 'days');
                                            console.log(holiday_leave_4.length, 'holiday_leave_1.length');
                                            console.log('holiday_leave_1', holiday_leave_4);
                                            totalDaysPart1 = totalDaysPart1 - holiday_leave_4.length
                                            totalDaysPart2 = totalDaysPart2 - holiday_leave_3.length
                                            console.log('totalDaysPart1', totalDaysPart1);
                                            console.log('totalDaysPart2', totalDaysPart2);
                                            // return
                                            leave_taken_1 = totalDaysPart1
                                            leave_taken_2 = totalDaysPart2
                                            console.log('leave_taken_2111111111111', leave_taken_2);

                                        }
                                        console.log('leave_taken_2333333333333333', leave_taken_2);

                                    }

                                    else {
                                        console.log('else');
                                        for (let i = 0; i < leave_day1.length; i++) {
                                            leave_taken_1 += leave_day1[i].total_number_of_day
                                        }

                                        for (let i = 0; i < leave_day2.length; i++) {
                                            leave_taken_2 += leave_day2[i].total_number_of_day
                                        }
                                        console.log('leave_taken_24444444444444', leave_taken_2);
                                        console.log('leave_taken_13456789', leave_taken_1);
                                    }

                                }
                            }
                            var year_leave_ = await yearModal.findOne({ year: year })
                            leave_balence_year = year_leave_.leave
                            working_days_2 = total_month_day2 - holiday_leave_2.length
                            present_days_2 = working_days_2 - leave_taken_2
                            // return
                            const date_effective = new Date(dateString);
                            const year_effective = date_effective.getFullYear();
                            const month_effective = date_effective.getMonth();
                            const lastDayOfMonth = new Date(year_effective, month_effective + 1, 0);
                            const daysUntilLastDayOfMonth = lastDayOfMonth.getDate() - date_effective.getDate();
                            const array = empinfo_modal.base_salary_list
                            const element = empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i]
                            const index = array.indexOf(element);
                            if ((month_effective + 1) == month) {
                                working_days_1 = Number(daysUntilLastDayOfMonth) - holiday_leave_1.length
                                present_days = working_days - leave_taken_1
                                present_days_1 = (working_days_1 - leave_taken_1) + leave_balence_year
                            }

                            else {
                                working_days_1 = total_month_day1 - holiday_leave_1.length
                                present_days_1 = (working_days_1 - leave_taken_1) + leave_balence_year
                            }
                            working_days = working_days_1 + working_days_2
                            if (((month_effective + 1) == month) && (index == 0)) {
                                present_days_1 = 0
                                working_days_1 = 0
                                salary_emp_1 = empinfo_modal.base_salary_list[0].salary_
                                salary_emp_2 = empinfo_modal.base_salary_list[0].salary_
                                working_days = Number(month_array[Number(req.query.month) - 1]) - holiday_modal
                            }
                            present_days = (present_days_1 + present_days_2) - leave_balence_year
                            emp_leave_taken = leave_taken_1 + leave_taken_2
                            var balance_days = leave_balence_year - emp_leave_taken
                            total_paid_days = present_days + leave_balence_year

                            for (let i = 0; i < effective_date_emp.length; i++) {
                                result = compareDates(year, month, effective_date_emp[i].effective_date);
                                if (result == "before") {
                                    if (i === 0) {
                                        salary_emp = effective_date_emp[i].salary_
                                    } else {
                                        salary_emp = effective_date_emp[i - 1].salary_
                                    }
                                    break
                                } else {
                                    salary_emp = effective_date_emp[i].salary_
                                }
                            }

                            if (empinfo_modal.base_salary_list.length === 1) {
                                console.log('1empluyt1');
                                salary_emp_1 = Number(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - 1].salary_)
                                salary_emp_2 = 0
                            }


                            else if (empinfo_modal.base_salary_list.length === 2) {
                                console.log('employ2');
                                salary_emp_1 = Number(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - 2].salary_)
                                salary_emp_2 = Number(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - 1].salary_)

                            }

                            else {
                                for (var i = 1; i < effective_date_emp.length; i++) {
                                    console.log(i, i - 1);
                                    const date = new Date(effective_date_emp[i].effective_date)
                                    console.log(date, '222');
                                    const effective_month = date.getMonth() + 1
                                    if (effective_month == month) {
                                        console.log('true');
                                        console.log(i, 'effective_date_emp', (i - 1), '1', i);
                                        salary_emp_1 = Number(empinfo_modal.base_salary_list[i - 1].salary_)
                                        salary_emp_2 = Number(empinfo_modal.base_salary_list[i].salary_)
                                        break;
                                    }

                                }
                            }

                            var gross_basic_da = Math.round(salary_emp_1 / 2)
                            var gross_hra = Math.round((gross_basic_da * 40) / 100)
                            var gross_ra = Math.round((gross_basic_da * 15) / 100)
                            var gross_flexi_benifits = Math.round(salary_emp_1 - gross_basic_da - gross_hra - gross_ra)
                            var earned_basic_da = Math.round((gross_basic_da / working_days) * total_paid_days)
                            var earned_hra = Math.round((gross_hra / working_days) * total_paid_days)
                            var earned_ra = Math.round((gross_ra / working_days) * total_paid_days)
                            var earned_flexi_benifits = Math.round((gross_flexi_benifits / working_days) * total_paid_days)

                            var net_pay_in_number_1 = (salary_emp_1 / working_days) * present_days_1
                            var net_pay_in_number_2 = (salary_emp_2 / working_days) * present_days_2
                            var net_pay_in_number = net_pay_in_number_1 + net_pay_in_number_2
                                + Number(req.body.arrear) + Number(req.body.additional)
                            net_pay_in_number = Math.round(net_pay_in_number)
                            var net_pay_in_word = convertRupeesIntoWords(net_pay_in_number)
                            const salary = new SalaryModal({
                                Employee_name: empinfo_modal.First_Name + " " + empinfo_modal.Last_Name,
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
                                Total_earn: net_pay_in_number,
                                Net_pay_in_number: net_pay_in_number,
                                Net_pay_in_words: net_pay_in_word,
                                ARRS: Number(req.body.arrear) + Number(arrear_effective_date),
                                Additional: Number(req.body.additional),
                                ARRS_Comment: req.body.arrear_comment,
                                Additional_Comment: req.body.additional_comment,

                            });

                            salary.save();
                            arr.push(1)
                            return res.status(200).send({ success: true, 'salary': salary })

                        }
                    }
                }
                for (var i = 1; i < effective_date_emp.length; i++) {
                    if (arr.length == 0) {
                        if (moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date).month() + 1 != Number(month) || (moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date).year()) != Number(year)) {
                            const holiday_modal = await HolidayModal.find({
                                holiday_date: {
                                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                                    $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                                }

                            });
                            var emp_leave_taken = 0
                            working_days = Number(month_array[Number(req.query.month) - 1]) - holiday_modal.length

                            const leave_modal = await LeaveModal.find({
                                userid: req.query.userid,
                                from_date: {
                                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                                    $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                                },
                                to_date: {
                                    $gte: new Date(req.query.year, req.query.month - 1, 1),
                                    $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
                                }
                            });
                            for (let i = 0; i < leave_modal.length; i++) {
                                emp_leave_taken += leave_modal[i].total_number_of_day
                            }

                            const compareDates = (year, month, effective_date_emp) => {
                                var month_flag = Number(month) < 10 ? "0" : ""
                                var to_match_date = year + "-" + month_flag + month + "-" + effective_date_emp.toString().slice(8, 10);
                                const effectiveDate = new Date(effective_date_emp);
                                const toMatchDate = new Date(`${to_match_date}T00:00:00.000Z`);

                                if (toMatchDate <= effectiveDate) {
                                    return "before";
                                } else {
                                    return "after";
                                }

                            }
                            present_days = working_days - emp_leave_taken
                            if (moment(empinfo_modal.date_of_joining).date() > 15) {
                                leave_balence_year = 0
                            }
                            else if (present_days === 0) {
                                leave_balence_year = 0
                            }
                            else {
                                var year_leave_ = await yearModal.findOne({ year: year })
                                leave_balence_year = year_leave_.leave

                            }
                            var balance_days = leave_balence_year - emp_leave_taken
                            total_paid_days = present_days + leave_balence_year;
                            for (let i = 0; i < effective_date_emp.length; i++) {
                                result = compareDates(year, month, effective_date_emp[i].effective_date);
                                if (result == "before") {
                                    if (i === 0) {
                                        salary_emp = effective_date_emp[i].salary_
                                    } else {
                                        salary_emp = effective_date_emp[i - 1].salary_
                                    }
                                    break
                                } else {
                                    salary_emp = effective_date_emp[i].salary_
                                }
                            }
                            var gross_basic_da = Math.round(salary_emp / 2)
                            var gross_hra = Math.round((gross_basic_da * 40) / 100)
                            var gross_ra = Math.round((gross_basic_da * 15) / 100)
                            var gross_flexi_benifits = Math.round(salary_emp - gross_basic_da - gross_hra - gross_ra)
                            var earned_basic_da = Math.round((gross_basic_da / working_days) * total_paid_days)
                            var earned_hra = Math.round((gross_hra / working_days) * total_paid_days)
                            var earned_ra = Math.round((gross_ra / working_days) * total_paid_days)
                            var earned_flexi_benifits = Math.round((gross_flexi_benifits / working_days) * total_paid_days)
                            var net_pay_in_number = (salary_emp / working_days) * total_paid_days
                                + Number(req.body.arrear) + Number(req.body.additional)
                            net_pay_in_number = Math.round(net_pay_in_number)
                            var net_pay_in_word = convertRupeesIntoWords(net_pay_in_number)
                            const salary = new SalaryModal({
                                Employee_name: empinfo_modal.First_Name + " " + empinfo_modal.Last_Name,
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
                                Total_earn: net_pay_in_number,
                                Net_pay_in_number: net_pay_in_number,
                                Net_pay_in_words: net_pay_in_word,
                                ARRS: Number(req.body.arrear) + Number(arrear_effective_date),
                                Additional: Number(req.body.additional),
                                ARRS_Comment: req.body.arrear_comment,
                                Additional_Comment: req.body.additional_comment,

                            });

                            salary.save();
                            return res.status(200).send({ success: true, 'salary': salary })
                            arr.push(1)

                        }
                    }
                }
            }
        }
    }
}
module.exports = new Salary();