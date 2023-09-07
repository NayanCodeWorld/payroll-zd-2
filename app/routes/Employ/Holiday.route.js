"use strict";

const router = require("express").Router();
const {
  holiday,
  get_holiday,
  update_holiday,
  get_Fastival,
  holiday_delete,
  get_Holiday_all,
} = require("../../controllers/Employ/Holiday.controller");

router.post("/holiday", holiday);
router.post("/get_holiday", get_holiday);
router.post("/holiday_update/:id", update_holiday);
router.post("/holiday_dalate/:id", holiday_delete);
router.post("/get-holiday", get_Holiday_all);
router.post("/get-fastival", get_Fastival);
module.exports = router;
