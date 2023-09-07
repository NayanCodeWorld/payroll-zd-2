export function leaveValidateForm(fields) {
  //console.log("------------", fields);
  let formIsValid = true;
  let errObj = {};

  if (Object.keys(fields).length === 0) {
    console.log("Error");
    formIsValid = false;
  }
  if (!fields.userid || fields.userid == "") {
    errObj["userid"] = "*Please Select Employee.";
    formIsValid = false;
  }
  if (!fields.from_date || fields.from_date == "") {
    errObj["from_date"] = "*Please Select From Date.";
    formIsValid = false;
  }
  if (!fields.to_date || fields.to_date == "") {
    errObj["to_date"] = "*Please Select To Date.";
    formIsValid = false;
  }
  if (!fields.leave_type || fields.leave_type == "") {
    errObj["leave_type"] = "*Please Select Leave Type.";
    formIsValid = false;
  }
  if (!fields.reason_for_leave || fields.reason_for_leave == "") {
    errObj["reason_for_leave"] = "*Please Select Reason.";
    formIsValid = false;
  }
  return { formIsValid, errObj };
}
