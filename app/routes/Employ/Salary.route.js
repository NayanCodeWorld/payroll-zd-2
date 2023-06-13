
"use strict"

const router = require("express").Router()
const {salary_, get_salary, update_salary,salary_delete, get_one_emp, get_salary_id } = require('../../controllers/Employ/Salary.controller')

router.post('/salary_', salary_)
// router.post('/get_salary', get_salary)
// router.post('/update/:id', update_salary)
// router.post('/delete_salary/:id', salary_delete)
// router.get('/get_salary_id', get_salary_id)
// router.get('/get-one-user/:id', get_one_emp)


module.exports = router;