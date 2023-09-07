export function validateForm(fields, checkUpdate) {
  //console.log("fields----validateForm-", fields);
  var formIsValid = true;
  let errObj = {};
  let alfhaRegex = /^[A-Za-z]+$/;
  if (Object.keys(fields).length === 0) {
    console.log("Error");
    formIsValid = false;
  }
  // if(!fields.Employee_Code || fields.Employee_Code == ""){
  //     errObj['Employee_Code'] = '*Field is required'
  //     formIsValid = false
  // }
  if (
    !fields.First_Name ||
    fields.First_Name == "" ||
    fields.First_Name.length < 3
  ) {
    errObj["First_Name"] = "*Please Enter Fisrt Name.";
    formIsValid = false;
  }
  if (
    !fields.Last_Name ||
    fields.Last_Name == "" ||
    fields.Last_Name.length < 3
  ) {
    errObj["Last_Name"] = "*Please Enter Last Name.";
    formIsValid = false;
  }
  if (
    !fields.fatherName ||
    fields.fatherName == "" ||
    fields.fatherName.length < 3
  ) {
    errObj["fatherName"] = "*Please Enter Father Name.";
    formIsValid = false;
  }
  if (!fields.date_of_birth || fields.date_of_birth == "") {
    errObj["date_of_birth"] = "*Please Enter DOB.";
    formIsValid = false;
  }
  if (!fields.date_of_joining || fields.date_of_joining == "") {
    errObj["date_of_joining"] = "*Please Enter DOJ.";
    formIsValid = false;
  }
  if (
    !fields.Contact_Number ||
    fields.Contact_Number.toString().length != 10 ||
    (fields.Contact_Number.toString().charAt(0) != "9" &&
      fields.Contact_Number.toString().charAt(0) != "8" &&
      fields.Contact_Number.toString().charAt(0) != "7" &&
      fields.Contact_Number.toString().charAt(0) != "6")
  ) {
    errObj["Contact_Number"] = "*Please Enter Valid Number.";
    formIsValid = false;
  }
  if (
    !fields.Alternate_Contact_number ||
    fields.Alternate_Contact_number.toString().length != 10 ||
    (fields.Alternate_Contact_number.toString().charAt(0) != "9" &&
      fields.Alternate_Contact_number.toString().charAt(0) != "8" &&
      fields.Alternate_Contact_number.toString().charAt(0) != "7" &&
      fields.Alternate_Contact_number.toString().charAt(0) != "6")
  ) {
    errObj["Alternate_Contact_number"] = "*Please Enter Valid Number.";
    formIsValid = false;
  }
  if (
    !fields.Contact_Number_Home ||
    fields.Contact_Number_Home.toString().length != 10 ||
    (fields.Contact_Number_Home.toString().charAt(0) != "9" &&
      fields.Contact_Number_Home.toString().charAt(0) != "8" &&
      fields.Contact_Number_Home.toString().charAt(0) != "7" &&
      fields.Contact_Number_Home.toString().charAt(0) != "6")
  ) {
    errObj["Contact_Number_Home"] = "*Please Enter Valid Number.";
    formIsValid = false;
  }
  let emailRegex =
    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!fields.email || !emailRegex.test(fields.email)) {
    errObj["email"] = "*Please Enter Valid Email.";
    formIsValid = false;
  }
  if (!fields.Blood_Group || fields.Blood_Group == "") {
    errObj["Blood_Group"] = "*Please Select Blood Group.";
    formIsValid = false;
  }
  if (!fields.Position || fields.Position == "") {
    errObj["Position"] = "*Please Enter Position.";
    formIsValid = false;
  }
  if (!fields.gender || fields.gender == "") {
    errObj["gender"] = "*Please Select Gender.";
    formIsValid = false;
  }
  if (!fields.Marital_Status || fields.Marital_Status == "") {
    errObj["Marital_Status"] = "*Field is required";
    formIsValid = false;
  }
  if (!checkUpdate) {
    if (!fields.base_salary || fields.base_salary == "") {
      errObj["base_salary"] = "*Please Enter Base Salary";
      formIsValid = false;
    }
    if (!fields.effective_date || fields.effective_date == "") {
      errObj["effective_date"] = "*Please Enter Effective Date";
      formIsValid = false;
    }
  }
  if (!fields.Bank_IFSC || fields.Bank_IFSC.length != 11) {
    errObj["Bank_IFSC"] = "*Please Enter Valid Bank IFSC.";
    formIsValid = false;
  }
  if (
    !fields.Bank_No ||
    fields.Bank_No.toString().length < 9 ||
    fields.Bank_No.toString().length > 17
  ) {
    errObj["Bank_No"] = "*Please Enter Valid Bank Number.";
    formIsValid = false;
  }
  if (!fields.PAN_No || fields.PAN_No.toString().length != 10) {
    errObj["PAN_No"] = "*Please Enter Valid Pan Number.";
    formIsValid = false;
  }
  if (!fields.ADHAR || fields.ADHAR.toString().length != 12) {
    errObj["ADHAR"] = "*Please Enter Valid Aadhar Number.";
    formIsValid = false;
  }
  if (!fields.DEGREE || fields.DEGREE == "") {
    errObj["DEGREE"] = "*Field is required.";
    formIsValid = false;
  }
  if (!fields.STREAM || fields.STREAM == "" || fields.STREAM.length < 2) {
    errObj["STREAM"] = "*Please Enter Stream.";
    formIsValid = false;
  }
  if (!fields.PASSED || fields.PASSED == "") {
    errObj["PASSED"] = "*Field is required";
    formIsValid = false;
  }
  if (!fields.YEAR_OF_PASSING || fields.YEAR_OF_PASSING == "") {
    errObj["YEAR_OF_PASSING"] = "*Please Enter Passing Year";
    formIsValid = false;
  }
  if (!fields.PERCENTAGE_OF_MARKS || fields.PERCENTAGE_OF_MARKS == "") {
    errObj["PERCENTAGE_OF_MARKS"] = "*Please Enter Percentage";
    formIsValid = false;
  }
  if (
    !fields.current_state ||
    fields.current_state == "" ||
    // !alfhaRegex.test(fields.current_state) ||
    fields.current_state.length < 2
  ) {
    errObj["current_state"] = "*Please Enter State.";
    formIsValid = false;
  }
  if (
    !fields.current_pin_code ||
    fields.current_pin_code.toString().length < 4 ||
    fields.current_pin_code.toString().length > 8
  ) {
    errObj["current_pin_code"] = "*Please Enter Current Pin.";
    formIsValid = false;
  }
  if (
    !fields.current_city ||
    fields.current_city == "" ||
    // !alfhaRegex.test(fields.current_city) ||
    fields.current_city.length < 3
  ) {
    errObj["current_city"] = "*Please Enter City.";
    formIsValid = false;
  }
  if (
    !fields.permanent_city ||
    fields.permanent_city == "" ||
    // !alfhaRegex.test(fields.permanent_city) ||
    fields.permanent_city.length < 3
  ) {
    errObj["permanent_city"] = "*Please Enter City.";
    formIsValid = false;
  }
  if (
    !fields.permanent_state ||
    fields.permanent_state == "" ||
    // !alfhaRegex.test(fields.permanent_state) ||
    fields.permanent_state.length < 2
  ) {
    errObj["permanent_state"] = "*Please Enter State.";
    formIsValid = false;
  }
  if (
    !fields.permanent_pin_code ||
    fields.permanent_pin_code.toString().length < 4 ||
    fields.permanent_pin_code.toString().length > 8
  ) {
    errObj["permanent_pin_code"] = "*Please Enter Permanent Pin.";
    formIsValid = false;
  }
  if (
    !fields.Current_Address ||
    fields.Current_Address == "" ||
    fields.Current_Address.length < 5
  ) {
    errObj["Current_Address"] = "*Please Enter Current Address";
    formIsValid = false;
  }
  if (
    !fields.Permanent_Address ||
    fields.Permanent_Address == "" ||
    fields.Permanent_Address.length < 5
  ) {
    errObj["Permanent_Address"] = "*Please Enter Permanent Address";
    formIsValid = false;
  }
  if (!fields.ctc?.toString() || fields.ctc?.toString() == "") {
    errObj["ctc"] = "*Field is required";
    formIsValid = false;
  }
  if (!fields.bonus?.toString() || fields.bonus?.toString() == "") {
    errObj["bonus"] = "*Field is required";
    formIsValid = false;
  }
  if (
    !fields.notice_period?.toString() ||
    fields.notice_period?.toString() == ""
  ) {
    errObj["notice_period"] = "*Field is required";
    formIsValid = false;
  }
  if (
    !fields.training_days?.toString() ||
    fields.training_days?.toString() == ""
  ) {
    errObj["training_days"] = "*Field is required";
    formIsValid = false;
  }
  console.log("errObj", errObj);
  return { formIsValid, errObj };
}
