"use strict";

const router = require("express").Router();
const { check } = require("express-validator");

const {
  add_employ,
  get_emlpoy,
  emp_delete,
  emp_update,
  get_one_emp,
  get_user_id,
  udateStatus_emlpoy,
  emp_soft_delete,
} = require("../../controllers/Employ/EmpInfo.cotroller");

const {
  Leave,
  get_salary,
} = require("../../controllers/Employ/Leave.cotroller");
const EmpInfoModal = require("../../models/Employ/Employ.model");

router.post(
  "/add_employ",
  [
    check("email").isEmail().normalizeEmail(),
    check("First_Name", "First_Name is required")
      .not()
      .isEmpty()
      .isLength({ min: 3, max: 50 }),
    check("Last_Name", "Last_Name no is required")
      .not()
      .isEmpty()
      .isLength({ min: 3, max: 50 }),
    check("date_of_birth", "date_of_birth is required").not().notEmpty(),
    check("date_of_joining", "date_of_joining is required ").not().notEmpty(),
    check("Contact_Number_Home", "Contact_Number_Home is required")
      .not()
      .isEmpty(),
    check("Contact_Number", "Contact_Number is required").not().isEmpty(),
    // check('Permanent_Address ',' Permanent_Address is required').not().isEmpty(),
    check("fatherName", "fatherName is required").not().isEmpty(),
    check("PAN_No", "invalid pan number")
      .not()
      .isEmpty()
      .isLength({ min: 10, max: 10 }),
    check("ADHAR", "invalid adhar number")
      .not()
      .isEmpty()
      .isLength({ min: 12, max: 12 }),
    check("Bank_No", "Bank_No is required").not().isEmpty(),
  ],
  add_employ
);

router.get("/get_employ/:id", get_emlpoy);

router.post("/delete_emp/:id", emp_delete); // delete permanently

router.post("/soft_delete_emp/:id", emp_soft_delete); // delete from main table but save in archieve table

router.post("/update/:id", emp_update);

router.get("/emp_1/:id", get_one_emp);
// router.get('/',autoincrement)

router.post("/leave", Leave);

router.get("/get-all-user-id", get_user_id);

router.post("/update_status", udateStatus_emlpoy);

module.exports = router;
