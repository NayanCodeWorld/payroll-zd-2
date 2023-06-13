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

                console.log('Days from effective date to last day of the month:', daysUntilLastDayOfMonth);
                var working_days
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

                // const compareDates = (year, month, effective_date_emp) => {
                //     var month_flag = Number(month) < 10 ? "0" : ""
                //     var to_match_date = year + "-" + month_flag + month + "-" + effective_date_emp.toString().slice(8, 10);
                //     const effectiveDate = new Date(effective_date_emp);
                //     const toMatchDate = new Date(`${to_match_date}T00:00:00.000Z`);

                //     if (toMatchDate <= effectiveDate) {
                //         return "before";
                //     } else {
                //         return "after";
                //     }

                // }
                console.log('working_days', working_days, 'emp_leave_taken', emp_leave_taken);

                if (present_days === 0) {
                    leave_balence_year = 0
                }
                else {
                    var year_leave_ = await yearModal.findOne({ year: year })
                    leave_balence_year = year_leave_.leave


                }
                console.log(working_days_1, 'working_days_1');
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
                console.log('net_pay_in_number', net_pay_in_number);


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
                for (var i = 1; i < effective_date_emp.length; i++) {
                    console.log('3333333333333333333333333333333333');
                    if (arr.length == 0) {
                        if (moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date).month() + 1 == Number(month) && (moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date).year()) == Number(year)) {

                            console.log('if condition effective date ');
                            var leave_balence_year = 0
                            var emp_leave_taken = 0
                            var leave_taken_1 = 0
                            var leave_taken_2 = 0
                            var working_days = 0
                            var working_days_1 = 0
                            var working_days_2 = 0
                            var present_days = 0
                            var present_days_1 = 0
                            var present_days_2 = 0
                            var total_paid_days
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
                                console.log('true');
                                let effective_day1 = effective_date_emp[i - 1].effective_date
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
                            console.log(leave_modal != 0);
                            for (let i = 0; i < leave_modal.length; i++) {
                                console.log('111111111111111');
                                emp_leave_taken += leave_modal[i].total_number_of_day
                                var from_date1 = leave_modal[i].from_date
                                var to_date1 = leave_modal[i].to_date
                                console.log('from_date1', from_date1, 'to_date1', to_date1);
                            }
                            const fromDate = new Date(from_date1);
                            const toDate = new Date(to_date1);
                            const effectiveDate = new Date(formattedLastEffectiveDate);
                            console.log('effectiveDate', effectiveDate, 'fromDate', fromDate, 'toDate', toDate);
                            if (effectiveDate >= fromDate && effectiveDate <= toDate) {
                                console.log('Effective date is between from date and to date'); if (leave_modal != 0) {
                                    console.log('leave_modal', leave_modal);
                                    var holiday_leave_3 = await HolidayModal.find({
                                        holiday_date: {
                                            $gte: formattedLastEffectiveDate,
                                            $lte: toDate
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

                                    totalDaysPart1 = totalDaysPart1 - holiday_leave_1.length
                                    totalDaysPart2 = totalDaysPart2 - holiday_leave_3.length
                                    console.log('totalDaysPart1', totalDaysPart1);
                                    console.log('totalDaysPart2', totalDaysPart2);
                                    leave_taken_1 = totalDaysPart1
                                    leave_taken_2 = totalDaysPart2
                                }
                            }

                            else {

                                for (let i = 0; i < leave_day1.length; i++) {
                                    leave_taken_1 += leave_day1[i].total_number_of_day
                                }

                                for (let i = 0; i < leave_day2.length; i++) {
                                    leave_taken_2 += leave_day2[i].total_number_of_day
                                }

                            }
                            // return
                            console.log('leave_taken_1', leave_taken_1, 'leave_taken_2', leave_taken_2);
                            var year_leave_ = await yearModal.findOne({ year: year })
                            leave_balence_year = year_leave_.leave

                            working_days_1 = total_month_day1 - holiday_leave_1.length
                            console.log(total_month_day1, 'total_month_day1');
                            console.log('holiday_leave_1.length', holiday_leave_1.length);
                            working_days_2 = total_month_day2 - holiday_leave_2.length
                            console.log('holiday_leave_1', holiday_leave_2);
                            console.log('working_days_2', working_days_2, 'holiday_leave_2.length', holiday_leave_2.length);
                            working_days = working_days_1 + working_days_2
                            present_days_1 = (working_days_1 - leave_taken_1) + leave_balence_year
                            present_days_2 = working_days_2 - leave_taken_2
                            console.log(present_days_1, 'present_days_1');
                            console.log('present_days_2', present_days_2);
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
                                console.log("effective_date_emp", effective_date_emp);

                                for (var i = 0; i < effective_date_emp.length; i++) {
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
                            console.log('present_days_1', present_days_1);
                            var net_pay_in_number_2 = (salary_emp_2 / working_days) * present_days_2
                            console.log('present_days_2', present_days_2);
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
                            return res.status(200).send({ success: true, 'salary': salary })
                            arr.push(1)
                        }
                    }
                }
                for (var i = 1; i < effective_date_emp.length; i++) {
                    console.log('44444444444444444444444444444');
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
                            console.log('working_days', working_days, 'emp_leave_taken', emp_leave_taken);
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
                            console.log('present_days', present_days, leave_balence_year, 'leave_balence_year');
                            // var total_paid_days = (present_days + leave_balence_year)
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
                            arr.push(1)

                        }
                    }
                }


                console.log(arr);

            }
        }

    }


    // async salary_(req, res, next) {
    //     const year = req.query.year;
    //     const userid = req.query.userid;
    //     const month = req.query.month
    //     const arrear_effective_date = 0
    //     console.log("data");

    //     if (!req.query.userid || !req.query.year || !req.query.month) {
    //         return res.send({ message: "Please fill in all fields." });
    //     }
    //     var Salary_Modal = await SalaryModal.find({
    //         userid: req.query.userid,
    //         Salary_Slip_Year: req.query.year,
    //         Salary_Slip_Month: req.query.month,
    //     })
    //     if (Salary_Modal.length != 0 && !req.body.overwrite_payslip) {
    //         console.log(Salary_Modal[0], '..................')
    //         return res.send(Salary_Modal[0])
    //     }

    //     var empinfo_modal = await EmpInfoModal.find({
    //         _id: req.query.userid
    //     })
    //     empinfo_modal = empinfo_modal[0]

    //     var effective_date_emp = empinfo_modal.base_salary_list
    //     // console.log("effective_date_emp", effective_date_emp);
    //     // console.log("effective_date_emp", effective_date_emp.length);



    //     // Get Start date end date
    //     function getMonthStartAndEndDate(month, year) {
    //         // Create a new Date object
    //         var date = new Date(year, month, 1);
    //         var date = new Date(date);

    //         // Add 5 hours and 30 minutes
    //         date.setHours(date.getHours() + 5);
    //         date.setMinutes(date.getMinutes() + 30);

    //         console.log(date)

    //         // Get the start date of the month
    //         var startDate = date.toISOString().split("T")[0]
    //         // console.log("startDate", startDate);
    //         // Move to the next month
    //         date.setMonth(date.getMonth() + 1);

    //         // Set the day to 0, which will be the last day of the previous month
    //         date.setDate(0);

    //         // Get the end date of the month
    //         var endDate = date.toISOString().split("T")[0]
    //         // console.log("date", date.toISOString().split("T")[0]);


    //         return { startDate: startDate, endDate: endDate };
    //     }

    //     // Example usage: Get the start and end dates of January 2023
    //     var monthStarEnd = getMonthStartAndEndDate(month, year);
    //     // First Time Salary genrate
    //     if (effective_date_emp.length == 1) {

    //         // console.log("effective_date_emp 1", effective_date_emp);

    //     } else if (effective_date_emp.length > 1) {

    //         // Calculate Salary
    //         async function CreateSallary() {


    //             const startDate = new Date(monthStarEnd.startDate);
    //             const endDate = new Date(monthStarEnd.endDate);

    //             var MonthDay = []
    //             var LeaveArr = []
    //             var HolidayArr = []

    //             var holiday_leave = await HolidayModal.find({}, { holiday_date: 1 })

    //             var Leave = await LeaveModal.find({ userid: req.query.userid })

    //             Leave.forEach((leave) => {

    //                 for (let currentDate1 = new Date(leave.from_date); currentDate1 <= new Date(leave.to_date); currentDate1.setDate(currentDate1.getDate() + 1)) {
    //                     LeaveArr.push(currentDate1.toDateString())
    //                 }

    //             })

    //             // console.log("Leave", LeaveArr);

    //             // MONTH DAY LIST
    //             for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    //                 MonthDay.push(currentDate.toDateString())
    //             }


    //             var matches = [];
    //             // CHECK THIS MONTH ANY EFFECTIVE DATE 
    //             effective_date_emp.forEach(function (obj) {
    //                 var effectiveDate = obj.effective_date.toDateString();

    //                 if (MonthDay.includes(effectiveDate)) {
    //                     matches.push(obj);
    //                 }
    //             });
    //             var currentMonth
    //             if (matches.length > 0) {
    //                 currentMonth = 2
    //             } else {
    //                 currentMonth = 1
    //             }


    //             var Efective = []
    //             for (var i = Number(month); i >= 0; i--) {

    //                 var matches1 = effective_date_emp.filter(function (obj) {


    //                     if (Efective.length < currentMonth) {
    //                         if (obj.effective_date.getMonth() === i) {
    //                             Efective.push(obj)
    //                             return
    //                         }
    //                     }

    //                 });


    //             }

    //             // console.log("Efective", Efective);

    //             // If Efective length 1 is this month no efective and length greather 1 mean this month effective
    //             if (Efective.length == 1) {
    //                 console.log("SALERY THIS MONTH NOT EFFECTIVE");



    //             } else if (Efective.length == 2) {

    //                 console.log("SALERY THIS MONTH YES EFFECTIVE");

    //                 var CurrentEffective = []


    //                 var matches2 = effective_date_emp.filter(function (obj) {
    //                     if (obj.effective_date.getMonth() == month) {
    //                         CurrentEffective.push(obj)
    //                         return

    //                     }

    //                 });
    //                 var ifInclude = CurrentEffective[0].effective_date

    //                 var include = MonthDay.includes(ifInclude.toDateString())
    //                 // console.log("include", include);

    //                 if (include == true) {

    //                     const targetIndex = MonthDay.indexOf(ifInclude.toDateString());

    //                     const datesBefore = MonthDay.slice(0, targetIndex);
    //                     const datesAfter = MonthDay.slice(targetIndex);

    //                     //   console.log(" Efective[0].salary", );
    //                     var holiday_leave1 = []
    //                     holiday_leave.forEach((val) => {
    //                         holiday_leave1.push(val.holiday_date.toDateString())
    //                     })
    //                     var Leave = []
    //                     Leave.forEach((val) => {
    //                         Leave.push(val.year.toDateString())
    //                     })
    //                     // console.log("year_Leave1", year_Leave1);

    //                     // HOLYDAY LEAVES
    //                     const filteredDates = datesBefore.filter(date => !holiday_leave1.includes(date));
    //                     const filteredDates1 = datesAfter.filter(date => !holiday_leave1.includes(date));


    //                     // LeaveArr LEAVES
    //                     const leaveSelf = filteredDates.filter(date => !LeaveArr.includes(date));
    //                     const leaveSelf1 = filteredDates1.filter(date => !LeaveArr.includes(date));

    //                   console.log("  LeaveArr",  LeaveArr);
    //                   console.log("leaveSelf1",leaveSelf1);

    //                     // ACTIVE DAYS
    //                     var activeDays = filteredDates.length + filteredDates1.length
    //                     console.log("activeDays",activeDays);


    //                     var leaveDays = leaveSelf.length + leaveSelf1.length
    //                     console.log("leaveDays",leaveDays);

    //                     var firstHalf = Efective[1].salary_ / activeDays
    //                     var SecondtHalf = Efective[0].salary_ / activeDays


    //                     var FIRSTS = filteredDates.length * firstHalf
    //                     var SECONDS = leaveSelf1.length * SecondtHalf


    //                     console.log('Dates before:', FIRSTS);
    //                     console.log('Dates after:', SECONDS);

    //                 }

    //             }









    //             return

    //             // var includLeave = MonthDay

    //             var FDate = 3000;
    //             var SDate = 6000;

    //             var LeavrStart = new Date('2023-06-08');
    //             var LeavrEnd = new Date('2023-06-12');

    //             var Fsalary = FDate / 30
    //             var Ssalary = SDate / 30






    //             return


    //         }
    //         CreateSallary()

    //     }



















    //     return


    //     if (Salary_Modal.length != 0 && req.body.overwrite_payslip || Salary_Modal.length == 0) {
    //         // return
    //         for (var i = effective_date_emp.length; i > 0; i--) {

    //             console.log('inter loop', i);
    //             if (moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date).month() + 1 == Number(month) && (moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date).year()) == Number(year)) {
    //                 // console.log('Number 1:', total_month_day1);
    //                 // console.log('Number 2:', total_month_day2);
    //                 console.log('inter loop', i);
    //                 var leave_balence_year = 0
    //                 var emp_leave_taken = 0
    //                 var leave_taken_1 = 0
    //                 var leave_taken_2 = 0
    //                 var working_days = 0
    //                 var working_days_1 = 0
    //                 var working_days_2 = 0
    //                 var present_days = 0
    //                 var present_days_1 = 0
    //                 var present_days_2 = 0
    //                 var total_paid_days
    //                 var salary_emp_1 = 0
    //                 var salary_emp_2 = 0
    //                 var result
    //                 var salary_emp = 0
    //                 var leave_2 = 0
    //                 var leave_1 = 0

    //                 var dateString = empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date
    //                 const date = new Date(dateString);
    //                 var effective_month = date.getMonth() + 1
    //                 console.log(effective_month);
    //                 const effectivr_year = date.getFullYear()
    //                 var effective_day = date.getDate()
    //                 console.log('effectivr_year', effectivr_year, 'effective_day', effective_day);
    //                 if (month == effective_month && year == effectivr_year) {
    //                     console.log('true');
    //                     let effective_day1 = effective_date_emp[i - 1].effective_date

    //                     var effective_month = month// July
    //                     var effectiveDateDay = effective_day
    //                     const startDate1 = new Date(new Date().getFullYear(), effective_month - 1, 1);
    //                     const endDate1 = new Date(new Date().getFullYear(), effective_month - 1, effectiveDateDay - 1);

    //                     const startDate2 = new Date(new Date().getFullYear(), effective_month - 1, effectiveDateDay);
    //                     const endDate2 = new Date(new Date().getFullYear(), effective_month - 1, new Date(new Date().getFullYear(), month, 0).getDate());
    //                     var total_month_day1 = Math.ceil((endDate1 - startDate1) / (1000 * 60 * 60 * 24)) + 1;
    //                     var total_month_day2 = Math.ceil((endDate2 - startDate2) / (1000 * 60 * 60 * 24)) + 1;
    //                 }
    //                 const leave_modal = await LeaveModal.find({
    //                     from_date: {
    //                         $gte: new Date(req.query.year, req.query.month - 1, 1),
    //                         $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
    //                     },
    //                     to_date: {
    //                         $gte: new Date(req.query.year, req.query.month - 1, 1),
    //                         $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
    //                     }
    //                 });


    //                 const holiday_modal = await HolidayModal.find({
    //                     holiday_date: {
    //                         $gte: new Date(req.query.year, req.query.month - 1, 1),
    //                         $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
    //                     }

    //                 });
    //                 const inputYear = year;
    //                 const inputMonth = month

    //                 const dateObj = new Date(inputYear, inputMonth - 1, 1);

    //                 const year1 = dateObj.getFullYear();
    //                 const month1 = String(dateObj.getMonth() + 1).padStart(2, '0');
    //                 const day = String(dateObj.getDate()).padStart(2, '0');

    //                 const holiday_day_start = `${year1}-${month1}-${day}`;
    //                 const dateObj1 = new Date(inputYear, inputMonth, 0);

    //                 const year2 = dateObj1.getFullYear();
    //                 const month2 = String(dateObj1.getMonth() + 1).padStart(2, '0');
    //                 const day1 = String(dateObj1.getDate()).padStart(2, '0');

    //                 const holiday_day_end = `${year2}-${month2}-${day1}`;


    //                 const lastEffectiveDate = moment(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - i].effective_date);

    //                 var formattedLastEffectiveDate = lastEffectiveDate.format('YYYY-MM-DD');
    //                 console.log('lastEffectiveDate', lastEffectiveDate);


    //                 var holiday_leave_1 = await HolidayModal.find({
    //                     holiday_date: {
    //                         $gte: holiday_day_start,
    //                         $lte: formattedLastEffectiveDate
    //                     }

    //                 })
    //                 var holiday_leave_2 = await HolidayModal.find({
    //                     holiday_date: {
    //                         $gte: formattedLastEffectiveDate,
    //                         $lte: holiday_day_end

    //                     }

    //                 })

    //                 for (let i = 0; i < leave_modal.length; i++) {

    //                     const leave_modal = await LeaveModal.find({
    //                         from_date: {
    //                             $gte: new Date(req.query.year, req.query.month - 1, 1),
    //                             $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
    //                         },
    //                         to_date: {
    //                             $gte: new Date(req.query.year, req.query.month - 1, 1),
    //                             $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
    //                         }
    //                     });
    //                     const fromDate = new Date(leave_modal[i].from_date);
    //                     const toDate = new Date(leave_modal[i].to_date);
    //                     const effectiveDate = new Date(formattedLastEffectiveDate);

    //                     // if (effectiveDate.getTime() >= fromDate.getTime() && effectiveDate.getTime() <= toDate.getTime()) {
    //                     //     const range1 = {
    //                     //         fromDate: fromDate,
    //                     //         toDate: new Date(effectiveDate.getTime() - 1),
    //                     //     };

    //                     //     const range2 = {
    //                     //         fromDate: effectiveDate,
    //                     //         toDate: toDate,
    //                     //     };

    //                     //     var holiday_leave_day1 = await HolidayModal.find({
    //                     //         holiday_date: {
    //                     //             $gte: fromDate,
    //                     //             $lte: new Date(effectiveDate.getTime() - 1)
    //                     //         }

    //                     //     })
    //                     //     var holiday_leave_day2 = await HolidayModal.find({
    //                     //         holiday_date: {
    //                     //             $gte: new Date(effectiveDate.getTime() - 1),
    //                     //             $lte: toDate

    //                     //         }

    //                     //     })
    //                     //     var totalDaysRange1 = 0
    //                     //     var totalDaysRange2 = 0

    //                     //     totalDaysRange1 = Math.floor((range1.toDate - range1.fromDate) / (1000 * 60 * 60 * 24)) + 1;
    //                     //     totalDaysRange2 = Math.floor((range2.toDate - range2.fromDate) / (1000 * 60 * 60 * 24)) + 1;
    //                     //     totalDaysRange1 = totalDaysRange1 - holiday_leave_day1.length
    //                     //     totalDaysRange2 = totalDaysRange2 - holiday_leave_day2.length


    //                     // }

    //                     var total_leave_count = leave_modal[i].total_number_of_day
    //                     // emp_leave_taken += leave_modal[i].total_number_of_day
    //                     console.log(total_leave_count, 'total_leave_count', typeof total_leave_count);
    //                     var leave_day1 = await LeaveModal.find({
    //                         userid: req.query.userid,
    //                         from_date: {
    //                             $gte: req.query.year + "-" + req.query.month + '-01',
    //                             $lte: formattedLastEffectiveDate
    //                         },
    //                         to_date: {
    //                             $gte: req.query.year + "-" + req.query.month + '-01',
    //                             $lt: formattedLastEffectiveDate
    //                         }
    //                     })

    //                     if (leave_day1 == 0) {
    //                         leave_1 = totalDaysRange1
    //                     } else {

    //                         leave_1 = leave_day1[i].total_number_of_day + leave_1 + totalDaysRange1
    //                     }

    //                     var leave_day2 = await LeaveModal.find({
    //                         userid: req.query.userid,
    //                         from_date: {
    //                             $gte: formattedLastEffectiveDate,
    //                             $lt: holiday_day_end
    //                         },
    //                         to_date: {
    //                             $gte: formattedLastEffectiveDate,
    //                             $lte: holiday_day_end
    //                         }
    //                     })

    //                     if (leave_day2 == 0) {
    //                         leave_2 = totalDaysRange2
    //                     }
    //                     else {

    //                         leave_2 = leave_day2[i].total_number_of_day + leave_2 + totalDaysRange2
    //                         console.log(leave_2);
    //                     }

    //                 }

    //                 var year_leave_ = await yearModal.findOne({ year: year })
    //                 leave_balence_year = year_leave_.leave

    //                 working_days_1 = total_month_day1 - holiday_leave_1.length
    //                 working_days_2 = total_month_day2 - holiday_leave_2.length
    //                 working_days = working_days_1 + working_days_2
    //                 present_days_1 = (working_days_1 - leave_1) + leave_balence_year
    //                 present_days_2 = working_days_2 - leave_2
    //                 console.log(present_days_1, 'present_days_1');
    //                 console.log('present_days_2', present_days_2);
    //                 present_days = present_days_1 + present_days_2
    //                 emp_leave_taken = leave_1 + leave_2
    //                 var balance_days = leave_balence_year - emp_leave_taken
    //                 total_paid_days = present_days

    //                 for (let i = 0; i < effective_date_emp.length; i++) {
    //                     result = compareDates(year, month, effective_date_emp[i].effective_date);
    //                     if (result == "before") {
    //                         if (i === 0) {
    //                             salary_emp = effective_date_emp[i].salary_
    //                         } else {
    //                             salary_emp = effective_date_emp[i - 1].salary_
    //                         }
    //                         break
    //                     } else {
    //                         salary_emp = effective_date_emp[i].salary_
    //                     }
    //                 }

    //                 if (empinfo_modal.base_salary_list.length === 1) {
    //                     salary_emp_1 = Number(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - 1].salary_)
    //                     salary_emp_2 = 0
    //                 }


    //                 else if (empinfo_modal.base_salary_list.length === 2) {
    //                     salary_emp_1 = Number(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - 2].salary_)
    //                     salary_emp_2 = Number(empinfo_modal.base_salary_list[empinfo_modal.base_salary_list.length - 1].salary_)

    //                 }


    //                 else {
    //                     console.log("effective_date_emp", effective_date_emp);

    //                     for (var i = 0; i < effective_date_emp.length; i++) {
    //                         const date = new Date(effective_date_emp[i].effective_date)
    //                         const effective_month = date.getMonth() + 1
    //                         if (effective_month == month) {
    //                             salary_emp_1 = Number(empinfo_modal.base_salary_list[i - 1].salary_)
    //                             salary_emp_2 = Number(empinfo_modal.base_salary_list[i].salary_)

    //                         }
    //                     }
    //                 }


    //                 var gross_basic_da = Math.round(salary_emp_1 / 2)
    //                 var gross_hra = Math.round((gross_basic_da * 40) / 100)
    //                 var gross_ra = Math.round((gross_basic_da * 15) / 100)
    //                 var gross_flexi_benifits = Math.round(salary_emp_1 - gross_basic_da - gross_hra - gross_ra)
    //                 var earned_basic_da = Math.round((gross_basic_da / working_days) * total_paid_days)
    //                 var earned_hra = Math.round((gross_hra / working_days) * total_paid_days)
    //                 var earned_ra = Math.round((gross_ra / working_days) * total_paid_days)
    //                 var earned_flexi_benifits = Math.round((gross_flexi_benifits / working_days) * total_paid_days)

    //                 var net_pay_in_number_1 = (salary_emp_1 / working_days) * present_days_1
    //                 console.log('present_days_1', present_days_1);
    //                 var net_pay_in_number_2 = (salary_emp_2 / working_days) * present_days_2
    //                 console.log('present_days_2', present_days_2);
    //                 var net_pay_in_number = net_pay_in_number_1 + net_pay_in_number_2
    //                     + Number(req.body.arrear) + Number(req.body.additional)
    //                 net_pay_in_number = Math.round(net_pay_in_number)
    //                 var net_pay_in_word = convertRupeesIntoWords(net_pay_in_number)

    //                 const salary = new SalaryModal({
    //                     Employee_name: empinfo_modal.First_Name + " " + empinfo_modal.Last_Name,
    //                     userid: empinfo_modal._id,
    //                     Employee_code: empinfo_modal.Employee_Code,
    //                     designation: empinfo_modal.Position,
    //                     Salary_Slip_Month: req.query.month,
    //                     Salary_Slip_Year: req.query.year,
    //                     Date_of_Joining: empinfo_modal.date_of_joining,
    //                     Bank_Account_Number: empinfo_modal.Bank_No,
    //                     Bank_IFSC_Code: empinfo_modal.Bank_IFSC,
    //                     Total_Work_Days: working_days,
    //                     Leave_balence: leave_balence_year,
    //                     Leave_taken: emp_leave_taken,
    //                     Balence_days: balance_days,
    //                     Present_day: present_days,
    //                     Total_paid_day: total_paid_days,
    //                     Gross_Basic_DA: gross_basic_da,
    //                     Gross_HRA: gross_hra,
    //                     Gross_RA: gross_ra,
    //                     Gross_Flext_benefits: gross_flexi_benifits,
    //                     Gross_total: salary_emp,
    //                     Earned_Basic_DA: Math.round(earned_basic_da),
    //                     Earned_HRA: Math.round(earned_hra),
    //                     Earned_RA: Math.round(earned_ra),
    //                     Earned_Flext_benefits: Math.round(earned_flexi_benifits),
    //                     Total_earn: net_pay_in_number,
    //                     Net_pay_in_number: net_pay_in_number,
    //                     Net_pay_in_words: net_pay_in_word,
    //                     ARRS: Number(req.body.arrear) + Number(arrear_effective_date),
    //                     Additional: Number(req.body.additional),
    //                     ARRS_Comment: req.body.arrear_comment,
    //                     Additional_Comment: req.body.additional_comment,

    //                 });

    //                 salary.save();
    //                 return res.status(200).send({ success: true, 'salary': salary })



    //             }
    //             else {


    //                 const holiday_modal = await HolidayModal.find({
    //                     holiday_date: {
    //                         $gte: new Date(req.query.year, req.query.month - 1, 1),
    //                         $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
    //                     }

    //                 });
    //                 var emp_leave_taken = 0
    //                 working_days = Number(month_array[Number(req.query.month) - 1]) - holiday_modal.length

    //                 const leave_modal = await LeaveModal.find({
    //                     userid: req.query.userid,
    //                     from_date: {
    //                         $gte: new Date(req.query.year, req.query.month - 1, 1),
    //                         $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
    //                     },
    //                     to_date: {
    //                         $gte: new Date(req.query.year, req.query.month - 1, 1),
    //                         $lte: new Date(req.query.year, req.query.month - 1, month_array[Number(req.query.month) - 1], 23, 59, 59)
    //                     }
    //                 });
    //                 for (let i = 0; i < leave_modal.length; i++) {
    //                     emp_leave_taken += leave_modal[i].total_number_of_day
    //                 }

    //                 const compareDates = (year, month, effective_date_emp) => {
    //                     var month_flag = Number(month) < 10 ? "0" : ""
    //                     var to_match_date = year + "-" + month_flag + month + "-" + effective_date_emp.toString().slice(8, 10);
    //                     const effectiveDate = new Date(effective_date_emp);
    //                     const toMatchDate = new Date(`${to_match_date}T00:00:00.000Z`);

    //                     if (toMatchDate <= effectiveDate) {
    //                         return "before";
    //                     } else {
    //                         return "after";
    //                     }

    //                 }
    //                 present_days = working_days - emp_leave_taken
    //                 console.log('working_days', working_days, 'emp_leave_taken', emp_leave_taken);
    //                 if (moment(empinfo_modal.date_of_joining).date() > 15) {
    //                     leave_balence_year = 0
    //                 }
    //                 else if (present_days === 0) {
    //                     leave_balence_year = 0
    //                 }
    //                 else {
    //                     var year_leave_ = await yearModal.findOne({ year: year })
    //                     leave_balence_year = year_leave_.leave

    //                 }
    //                 var balance_days = leave_balence_year - emp_leave_taken
    //                 total_paid_days = present_days + leave_balence_year;
    //                 console.log('present_days', present_days, leave_balence_year, 'leave_balence_year');
    //                 // var total_paid_days = (present_days + leave_balence_year)
    //                 for (let i = 0; i < effective_date_emp.length; i++) {
    //                     result = compareDates(year, month, effective_date_emp[i].effective_date);
    //                     if (result == "before") {
    //                         if (i === 0) {
    //                             salary_emp = effective_date_emp[i].salary_
    //                         } else {
    //                             salary_emp = effective_date_emp[i - 1].salary_
    //                         }
    //                         break
    //                     } else {
    //                         salary_emp = effective_date_emp[i].salary_
    //                     }
    //                 }
    //                 var gross_basic_da = Math.round(salary_emp / 2)
    //                 var gross_hra = Math.round((gross_basic_da * 40) / 100)
    //                 var gross_ra = Math.round((gross_basic_da * 15) / 100)
    //                 var gross_flexi_benifits = Math.round(salary_emp - gross_basic_da - gross_hra - gross_ra)
    //                 var earned_basic_da = Math.round((gross_basic_da / working_days) * total_paid_days)
    //                 var earned_hra = Math.round((gross_hra / working_days) * total_paid_days)
    //                 var earned_ra = Math.round((gross_ra / working_days) * total_paid_days)
    //                 var earned_flexi_benifits = Math.round((gross_flexi_benifits / working_days) * total_paid_days)
    //                 var net_pay_in_number = (salary_emp / working_days) * total_paid_days
    //                 // + Number(req.body.arrear) + Number(req.body.additional)
    //                 net_pay_in_number = Math.round(net_pay_in_number)
    //                 var net_pay_in_word = convertRupeesIntoWords(net_pay_in_number)
    //                 const salary = new SalaryModal({
    //                     Employee_name: empinfo_modal.First_Name + " " + empinfo_modal.Last_Name,
    //                     userid: empinfo_modal._id,
    //                     Employee_code: empinfo_modal.Employee_Code,
    //                     designation: empinfo_modal.Position,
    //                     Salary_Slip_Month: req.query.month,
    //                     Salary_Slip_Year: req.query.year,
    //                     Date_of_Joining: empinfo_modal.date_of_joining,
    //                     Bank_Account_Number: empinfo_modal.Bank_No,
    //                     Bank_IFSC_Code: empinfo_modal.Bank_IFSC,
    //                     Total_Work_Days: working_days,
    //                     Leave_balence: leave_balence_year,
    //                     Leave_taken: emp_leave_taken,
    //                     Balence_days: balance_days,
    //                     Present_day: present_days,
    //                     Total_paid_day: total_paid_days,
    //                     Gross_Basic_DA: gross_basic_da,
    //                     Gross_HRA: gross_hra,
    //                     Gross_RA: gross_ra,
    //                     Gross_Flext_benefits: gross_flexi_benifits,
    //                     Gross_total: salary_emp,
    //                     Earned_Basic_DA: Math.round(earned_basic_da),
    //                     Earned_HRA: Math.round(earned_hra),
    //                     Earned_RA: Math.round(earned_ra),
    //                     Earned_Flext_benefits: Math.round(earned_flexi_benifits),
    //                     Total_earn: net_pay_in_number,
    //                     Net_pay_in_number: net_pay_in_number,
    //                     Net_pay_in_words: net_pay_in_word,
    //                     ARRS: Number(req.body.arrear) + Number(arrear_effective_date),
    //                     Additional: Number(req.body.additional),
    //                     ARRS_Comment: req.body.arrear_comment,
    //                     Additional_Comment: req.body.additional_comment,

    //                 });

    //                 salary.save();
    //                 return res.status(200).send({ success: true, 'salary': salary })

    //             }


    //         }
    //     }
    // }









}
module.exports = new Salary();