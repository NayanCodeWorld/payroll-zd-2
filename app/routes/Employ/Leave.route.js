"use strict";

const router = require("express").Router();
const {
  Leave,
  get_leave,
  leave_delete,
  update_laeve,
  get_leave_today,
  get_yesterday_leave_,
  get_User_leave,
  get_user_leave_id,
  get_User_leave_count,
  get_today_leave,
  get_yesterday_leave,
} = require("../../controllers/Employ/Leave.cotroller");

router.post("/leave", Leave); // to save leave in to db
router.get("/get_leave", get_leave); // get all leaves of db
// router.get('/get-user-id', get_user_id)
router.post("/get-user-leave/:id", get_user_leave_id); // All leaves of a employee
router.post("/leave_dalete/:id", leave_delete); // to delete any leave
router.put("/leave_update/:id", update_laeve); // to update any leave
router.post("/get_User_leave", get_User_leave); // get leave of a user between date range
router.post("/get_User_leave_count", get_User_leave_count); // for a user in date range
router.get("/get_today_leave", get_today_leave); // present and absent employees on today
router.get("/get_yesterday_leave", get_yesterday_leave); // present and absent employees on yesterday
router.get("/get_leave_today", get_leave_today);
router.get("/get_yesterday_leave_", get_yesterday_leave_);

module.exports = router;
