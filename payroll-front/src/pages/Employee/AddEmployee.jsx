import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { validateForm } from "./employeeValidation";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import host from "./../utils";
import { TiArrowBack } from "react-icons/ti";
import { FaTrash } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";

function AddEmployee(props) {
  console.log("props", props.data);
  let effective_lastIndex;
  if (props.data) {
    var propsObject = props.data;
    var base_salary_list = propsObject?.base_salary_list;
    effective_lastIndex = propsObject.base_salary_list?.length - 1;
  }
  const [effectivesObj, setEffectivesObj] = useState({
    base_salary: propsObject?.base_salary_list[effective_lastIndex].salary_,
    effective_date:
      propsObject?.base_salary_list[effective_lastIndex].effective_date,
  });
  const dobDateInputRef = useRef(null);
  const dojDateInputRef = useRef(null);
  const effectiveDateInputRef = useRef(null);
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const [submitDisable, setSubmitDisable] = useState(false);
  const navigate = useNavigate();
  const [effectiveDateState,setEffectiveDateState] = useState("");
  const [updateButton, setUpdateButton] = useState(true);

  useEffect(() => {
    if (propsObject && propsObject !== {} && propsObject !== undefined) {
      const lastIndex = propsObject.base_salary_list?.length - 1;
      // const effective_date = new Date(
      //   propsObject.base_salary_list[lastIndex].effective_date
      // )
      // propsObject = {
      //   base_salary: propsObject.base_salary_list[lastIndex].salary_,
      //   effective_date: effective_date,
      //   ...propsObject,
      // };
      // console.log("base_salary_list", base_salary_list);
      // if (effectiveDateInputRef.current && fieldObj.date_of_joining) {
      const today = new Date(
        propsObject.base_salary_list[lastIndex].effective_date
      )
        .toISOString()
        .split("T")[0];
      effectiveDateInputRef.current.setAttribute("min", today);
      // }
      propsObject && setFields(propsObject);
    }
  }, [propsObject]);

  function handleChange(e) {
    let fieldObj = { ...fields };
    fieldObj[e.target.name] = e.target.value;
    if (effectiveDateInputRef.current && fieldObj.date_of_joining) {
      const today = new Date(fieldObj.date_of_joining)
        .toISOString()
        .split("T")[0];
      effectiveDateInputRef.current.setAttribute("min", today);
    }
    if (propsObject) {
      const lastIndex = propsObject?.base_salary_list?.length - 1;
      const today = new Date(
        propsObject.base_salary_list[lastIndex].effective_date
      )
        .toISOString()
        .split("T")[0];
      effectiveDateInputRef.current.setAttribute("min", today);
    }
    setEffectivesObj({
      salary_: fieldObj.base_salary,
      effective_date: fieldObj.effective_date,
    });
    console.log("fieldObj", fieldObj);
    setFields(fieldObj);
  }

  const notify = (message) => {
    toast(
      message == "alredy exist ADHAR."
        ? "Aadhar already exiest"
        : message == "alredy exist PAN_NO."
        ? "Pan Number already exiest"
        : message == "alredy exist emails."
        ? "Email already exiest"
        : null,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };
  function submituserRegistrationForm(e) {
    e.preventDefault();
    console.log('fields',fields);
    const validationErrors = validateForm(fields);
    setErrors(validationErrors.errObj);
    if (validationErrors && validationErrors.formIsValid) {
      setSubmitDisable(true);
      axios
        .post(`${host}/emp/add_employ`, fields)
        .then((response) => {
          console.log("success", response.data);
          if (response.data.message == "Success ") {
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: "Employee Successfully Created!",
            }).then(() => {
              navigate("/employee/manageprofile");
            });
          } else {
            setSubmitDisable(false);
            notify(response.data.message);
          }
        })
        .catch((err) => {
          console.error("There was an error!", err);
        });
    }
  }

  function updateUserDetails(e) {
    e.preventDefault();
    const index = base_salary_list.length - 1;
    // console.log("effectivesObj", effectivesObj);

    const effectiveCondition =
      effectivesObj.base_salary == base_salary_list[index].salary_ ||
      effectivesObj.effective_date == base_salary_list[index].effective_date ||
      effectivesObj.salary_ == undefined ||
      effectivesObj.effective_date == undefined;
    // console.log("effectiveCondition", effectiveCondition);
    if (!effectiveCondition) {
      console.log("yes itss difff");
      base_salary_list.push(effectivesObj);
    }
    let finalData = { ...fields, base_salary_list };
    console.log("finalData", finalData);
    const validationErrors = validateForm(fields, true);
    setErrors(validationErrors.errObj);
    if (validationErrors && validationErrors.formIsValid) {
      setSubmitDisable(true);
      axios
        .post(`${host}/emp/update/` + props.data._id, finalData)
        .then((response) => {
          console.log("success", response);
          if (response.data.message == "updated successfully.") {
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: "Employee Successfully Updated!",
            }).then(() => {
              navigate("/employee/manageprofile");
            });
          } else {
            setSubmitDisable(false)
            notify(response.data.message);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }
  useEffect(() => {
    const today = new Date();
    if (dobDateInputRef.current) {
      var eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      eighteenYearsAgo = new Date(eighteenYearsAgo).toISOString().split("T")[0];
      dobDateInputRef.current.setAttribute("max", eighteenYearsAgo);
    }
    if (dojDateInputRef.current) {
      var oneMonthAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );
      oneMonthAgo = new Date(oneMonthAgo).toISOString().split("T")[0];
      dojDateInputRef.current.setAttribute("min", oneMonthAgo);
    }
  }, []);

  const handleInput = (event) => {
    const { value, selectionStart, selectionEnd } = event.target;
    const sanitizedValue = value.replace(
      /[!@#$%^&*()1234567890;:'"?/{}><,.=_-]/,
      ""
    );
    event.target.value = sanitizedValue;
    event.target.setSelectionRange(selectionStart, selectionEnd);
  };

  const handleEffectiveDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const i = base_salary_list.indexOf(index);
        if (i > -1) {
          base_salary_list.splice(i, 1);
          Swal.fire(
            "Deleted!",
            "Click on Update to make changes.",
            "success"
          )
        }
      }
    });
  };
  const handleEffectiveUpdate = (index) => {
    Swal.fire({
      title: "Are you sure about update?",
      icon: "warning",  
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const i = base_salary_list.indexOf(index);
        let min_date = 0;
        if (i > 0){
          min_date = base_salary_list[0].effective_date?.slice(0, 10)
        }
        // Get the effective date and base salary 
        const effectiveDate = base_salary_list[i].effective_date?.slice(0, 10)
        const baseSalary = base_salary_list[i].salary_

        // Get the base salary and effective date fields using their IDs
        const baseSalaryField = document.getElementById('base_salary');
        const effectiveDateField = document.getElementById('effective_date');

        // Set the values of the fields using the value property
        baseSalaryField.value = baseSalary;
        effectiveDateField.value = effectiveDate;
        setEffectiveDateState(i)
        setUpdateButton(false);

        if (min_date){
          effectiveDateField.min = min_date
        }
      }

    });
  };

  const updateEffectiveDate = (index) => {
        // Get the base salary and effective date fields using their IDs
        const baseSalaryField = document.getElementById('base_salary').value;
        const effectiveDateField = document.getElementById('effective_date').value;
      if (effectiveDateState){
        if (baseSalaryField && effectiveDateField) {
          base_salary_list[effectiveDateState].salary_ = baseSalaryField
          base_salary_list[effectiveDateState].effective_date = effectiveDateField
          Swal.fire(
            "Updated!",
            "Click on Update to make changes.",
            "success"
          )
        }}
        setUpdateButton(true);

    };
    


  return (
    <div className="">
      <Link to="/employee/manageprofile" className="btn text-dark">
        <TiArrowBack size={30} />
      </Link>
      <div style={{ display: "flex" }}>
        <ToastContainer />
        <div className="px-4 pt-3">
          <div className="row">
            <div className="col-12 edit_information">
              <div className="Account-details">
                <h5 className="text-left"> Personal Details</h5>
                <hr style={{ margin: "0px" }} />
                {props.data ? (
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group">
                        <label className="profile_details_text">
                          Employee Code
                        </label>
                        <input
                          type="text"
                          style={{ textTransform: "capitalize" }}
                          name="Employee_Code"
                          className="form-control"
                          placeholder="Employee Code"
                          value={fields.Employee_Code}
                          onChange={(e) => handleChange(e)}
                        />
                        <div className="errorMsg">{errors.Employee_Code}</div>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">First Name</label>
                      <input
                        onInput={handleInput}
                        type="text"
                        style={{ textTransform: "capitalize" }}
                        name="First_Name"
                        minLength="2"
                        maxLength="50"
                        className="form-control"
                        placeholder="First Name"
                        value={fields.First_Name}
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="errorMsg">{errors.First_Name}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">Last Name </label>
                      <input
                        type="text"
                        name="Last_Name"
                        minLength="2"
                        maxLength="50"
                        className="form-control"
                        placeholder="Last Name"
                        style={{ textTransform: "capitalize" }}
                        onInput={handleInput}
                        value={fields.Last_Name}
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="errorMsg">{errors.Last_Name}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Father's Name:
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        minLength="2"
                        maxLength="50"
                        value={fields.fatherName}
                        onChange={(e) => handleChange(e)}
                        onInput={handleInput}
                        className="form-control"
                        placeholder="Father's Name"
                        style={{ textTransform: "capitalize" }}
                      />
                      <div className="errorMsg">{errors.fatherName}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label>Contact No</label>
                      <input
                        type="number"
                        maxLength="12"
                        value={fields.Contact_Number}
                        onChange={(e) => handleChange(e)}
                        name="Contact_Number"
                        className="form-control"
                        placeholder="Mobile Number"
                      ></input>
                      <div className="errorMsg">{errors.Contact_Number}</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label>Alternate Contact No</label>
                      <input
                        type="number"
                        maxLength="12"
                        value={fields.Alternate_Contact_number}
                        onChange={(e) => handleChange(e)}
                        className="form-control"
                        name="Alternate_Contact_number"
                        placeholder="Alternate Contact (optional)"
                      ></input>
                      <div className="errorMsg">
                        {errors.Alternate_Contact_number}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label>Home Contact No.</label>
                      <input
                        type="number"
                        maxLength="12"
                        name="Contact_Number_Home"
                        className="form-control"
                        placeholder="Mobile Number"
                        value={fields.Contact_Number_Home}
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="errorMsg">
                        {errors.Contact_Number_Home}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                    <div className="form-group">
                      <label className="profile_details_text">Email ID</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        value={fields.email}
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="errorMsg">{errors.email}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Date of Birth
                      </label>
                      <input
                        ref={dobDateInputRef}
                        type="date"
                        name="date_of_birth"
                        className="form-control small_date"
                        placeholder="Date of Birth"
                        value={fields.date_of_birth?.substring(0, 10)}
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="errorMsg">{errors.date_of_birth}</div>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "red",
                        }}
                      >
                        {/* {errorMessage} */}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Date of Joining:
                      </label>
                      <input
                        min="2020-01-01"
                        type="date"
                        name="date_of_joining"
                        className="form-control small_date"
                        placeholder="Date Of Joining"
                        value={fields.date_of_joining?.substring(0, 10)}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                    <div className="errorMsg">{errors.date_of_joining}</div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Blood Group
                      </label>
                      <select
                        name="Blood_Group"
                        className="form-control"
                        value={fields.Blood_Group}
                        onChange={(e) => handleChange(e)}
                      >
                        <option disabled={true} selected={true}>
                          Choose Blood Group
                        </option>
                        <option>A+</option>
                        <option>O+</option>
                        <option>B+</option>
                        <option>AB+</option>
                        <option>A-</option>
                        <option>O-</option>
                        <option>B-</option>
                        <option>AB- </option>
                      </select>
                      <div className="errorMsg">{errors.Blood_Group}</div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">Position</label>
                      <select
                        name="Position"
                        className="form-control"
                        value={fields.Position}
                        onChange={(e) => handleChange(e)}
                      >
                        <option disabled={true} selected={true}>
                          Choose Position
                        </option>
                        <option>Software Architect</option>
                        <option>Project Manager</option>
                        <option>Team Lead</option>
                        <option>Principal Software Engineer</option>
                        <option>Senior Software Developer</option>
                        <option>Software Developer</option>
                        <option>Jr Software Developer</option>
                        <option>Intern Software Developer</option>
                        <option>Other</option>
                      </select>
                      <div className="errorMsg">{errors.Position}</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">Gender</label>
                      <div onChange={(e) => handleChange(e)}>
                        <input
                          type="radio"
                          value="Male"
                          name="gender"
                          checked={fields.gender == "Male"}
                        />{" "}
                        Male
                        <input
                          type="radio"
                          value="Female"
                          name="gender"
                          className="ml-2"
                          checked={fields.gender == "Female"}
                        />{" "}
                        Female
                      </div>
                      <div className="errorMsg">{errors.gender}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Marital Status
                      </label>

                      <div onChange={(e) => handleChange(e)}>
                        <input
                          type="radio"
                          value="Single"
                          name="Marital_Status"
                          checked={fields.Marital_Status == "Single"}
                        />{" "}
                        Single
                        <input
                          type="radio"
                          value="Married"
                          name="Marital_Status"
                          className="ml-2"
                          checked={fields.Marital_Status == "Married"}
                        />{" "}
                        Married
                      </div>
                      <div className="errorMsg">{errors.Marital_Status}</div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
            </div>
            <div className="col-12 edit_information">
              <div className="Account-details">
                <h5 className="text-left">Account Details</h5>{" "}
                <hr style={{ margin: "0px" }} />
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label>Bank A/C IFSC</label>
                      <input
                        name="Bank_IFSC"
                        value={fields.Bank_IFSC}
                        onChange={(e) => handleChange(e)}
                        className="form-control"
                        placeholder="Enter Bank IFSC"
                      ></input>
                      <div className="errorMsg">{errors.Bank_IFSC}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label>Bank A/C No</label>
                      <input
                        name="Bank_No"
                        value={fields.Bank_No}
                        onChange={(e) => handleChange(e)}
                        className="form-control"
                        placeholder="Enter Bank A/C No"
                      ></input>
                      <div className="errorMsg">{errors.Bank_No}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label>PAN No</label>
                      <input
                        name="PAN_No"
                        value={fields.PAN_No}
                        onChange={(e) => handleChange(e)}
                        className="form-control"
                        placeholder="Enter Pan Number"
                      ></input>
                      <div className="errorMsg">{errors.PAN_No}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label>Aadhaar No.</label>
                      <input
                        name="ADHAR"
                        type="number"
                        value={fields.ADHAR}
                        onChange={(e) => handleChange(e)}
                        className="form-control"
                        placeholder="Enter Aadhar"
                      ></input>
                      <div className="errorMsg">{errors.ADHAR}</div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="col-sm-12 edit_information">
                  <div className="Account-details">
                    <h5 className="text-left">Effective Details</h5>{" "}
                    <hr style={{ margin: "0px" }} />
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <div className="form-group d-flex flex-column">
                          <label>Base Salary</label>
                          {propsObject &&
                            base_salary_list.map((e) => {
                              return <label>₹ {e.salary_}</label>;
                            })}
                          <input
                            type="number"
                            name="base_salary"
                            value={fields.base_salary}
                            onChange={(e) => handleChange(e)}
                            className="form-control"
                            id="base_salary"
                            placeholder="Enter Base Salary"
                          ></input>
                          <div className="errorMsg">{errors.base_salary}</div>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <div className="form-group d-flex flex-column">
                          <label>Effective Date</label>
                          {propsObject &&
                            base_salary_list.map((e) => {
                              return (
                                <div className="d-flex justify-content-between align-items-center">
                                  <label>
                                    {e.effective_date?.slice(0, 10)}
                                  </label>
                                  <div className="d-flex">
                                    <span
                                      onClick={() => handleEffectiveUpdate(e)}
                                    >
                                      <BsPencilSquare />
                                    </span>
                                    {base_salary_list.length > 1 ? (
                                      <span
                                        onClick={() => handleEffectiveDelete(e)}
                                      >
                                        <FaTrash />
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                          <div className="d-flex flex-column">
                            <input 
                              ref={effectiveDateInputRef}
                              type="date"
                              name="effective_date"
                              value={fields.effective_date}
                              onChange={(e) => handleChange(e)}
                              className="form-control col-lg-8 col-md-8 col-sm-8 col-xs-8"
                              id="effective_date"
                              placeholder="Efffective Date"
                              disabled={!fields.date_of_joining}
                            ></input>
                            <button onClick={(e) => updateEffectiveDate()} className="col-lg-4 col-md-4 col-sm-4 col-xs-4" disabled={ updateButton }>Update</button>
                          </div>
                          <div className="errorMsg">
                            {errors.effective_date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="col-sm-12 edit_information">
                <div className="Account-details">
                  <h5 className="text-left">Educational Details</h5>{" "}
                  <hr style={{ margin: "0px" }} />
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                      <div className="form-group">
                        <label className="profile_details_text">Degree</label>
                        <select
                          name="DEGREE"
                          className="form-control"
                          value={fields.DEGREE}
                          onChange={(e) => handleChange(e)}
                        >
                          <option disabled={true} selected={true}>
                            Choose Degree
                          </option>
                          <option>BCA</option>
                          <option>MCA</option>
                          <option>B.Arch</option>
                          <option>BE/B.TECH</option>
                          <option>B.Sc</option>
                          <option>BPharma</option>
                          <option>BDS</option>
                          <option>BPT</option>
                          <option>BA</option>
                          <option>BBA</option>
                          <option>BMS</option>
                          <option>BFA</option>
                          <option>BEM</option>
                          <option>BFD</option>
                          <option>BSW</option>
                          <option>BBS</option>
                          <option>BTTM</option>
                          <option>LLB</option>
                          <option>B.Com</option>
                          <option>ME/M.TECH</option>
                          <option>MA</option>
                          <option>MSc</option>
                          <option>LLM</option>
                          <option>MBA</option>
                          <option>MPhil</option>
                          <option>MEd</option>
                          <option>MRes</option>
                          <option>Other</option>
                        </select>
                        <div className="errorMsg">{errors.DEGREE}</div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                      <div className="form-group">
                        <label>Stream</label>
                        <input
                          type="text"
                          min="2"
                          max="50"
                          style={{ textTransform: "capitalize" }}
                          pattern="[a-zA-Z0-9\s]*"
                          name="STREAM"
                          value={fields.STREAM}
                          onChange={(e) => handleChange(e)}
                          onInput={handleInput}
                          className="form-control"
                          placeholder="Enter Stream"
                        ></input>
                        <div className="errorMsg">{errors.STREAM}</div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                      <div className="form-group">
                        <label className="profile_details_text">
                          Passed/Appearing:
                        </label>
                        <select
                          name="PASSED"
                          className="form-control"
                          value={fields.PASSED}
                          onChange={(e) => handleChange(e)}
                        >
                          <option disabled={true} selected={true}>
                            Choose Passed/Appearing
                          </option>
                          <option value="passed">PASSED</option>
                          <option value="appearing">APPEARING</option>
                        </select>
                        <div className="errorMsg">{errors.PASSED}</div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                      <div className="form-group">
                        <label>Percentage of Marks </label>
                        <input
                          name="PERCENTAGE_OF_MARKS"
                          type="number"
                          value={fields.PERCENTAGE_OF_MARKS}
                          onChange={(e) => handleChange(e)}
                          className="form-control"
                          placeholder="Enter Percentage"
                        ></input>
                        <div className="errorMsg">
                          {errors.PERCENTAGE_OF_MARKS}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                      <div className="form-group">
                        <label>Year of Passing</label>
                        <input
                          name="YEAR_OF_PASSING"
                          value={fields.YEAR_OF_PASSING}
                          onChange={(e) => handleChange(e)}
                          className="form-control"
                          type="number"
                          placeholder="Enter Passing Year"
                        ></input>
                        <div className="errorMsg">{errors.YEAR_OF_PASSING}</div>
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
              </div>
            </div>
            <div className="col-12 edit_information">
              <div className="Account-details">
                <h5 className="text-left">Address Details</h5>{" "}
                <hr style={{ margin: "0px" }} />
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Current State
                      </label>
                      <input
                        type="text"
                        name="current_state"
                        minLength="2"
                        maxLength="50"
                        className="form-control"
                        placeholder="Current State"
                        style={{ textTransform: "capitalize" }}
                        value={fields.current_state}
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="errorMsg">{errors.current_state}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Current City
                      </label>
                      <input
                        type="text"
                        name="current_city"
                        minLength="2"
                        maxLength="50"
                        value={fields.current_city}
                        onChange={(e) => handleChange(e)}
                        className="form-control"
                        placeholder="Current City"
                        style={{ textTransform: "capitalize" }}
                      />
                      <div className="errorMsg">{errors.current_city}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Permanent State
                      </label>
                      <input
                        type="text"
                        name="permanent_state"
                        minLength="2"
                        maxLength="50"
                        className="form-control"
                        placeholder="Permanent State"
                        style={{ textTransform: "capitalize" }}
                        value={fields.permanent_state}
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="errorMsg">{errors.permanent_state}</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Permanent City
                      </label>
                      <input
                        type="text"
                        name="permanent_city"
                        minLength="2"
                        maxLength="50"
                        value={fields.permanent_city}
                        onChange={(e) => handleChange(e)}
                        className="form-control"
                        placeholder="Permanent City"
                        style={{ textTransform: "capitalize" }}
                      />
                      <div className="errorMsg">{errors.permanent_city}</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Current Pin Code
                      </label>
                      <input
                        type="number"
                        name="current_pin_code"
                        minLength="2"
                        maxLength="50"
                        className="form-control"
                        placeholder="Current Pin"
                        style={{ textTransform: "capitalize" }}
                        value={fields.current_pin_code}
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="errorMsg">{errors.current_pin_code}</div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Permanent Pin Code
                      </label>
                      <input
                        type="number"
                        name="permanent_pin_code"
                        minLength="2"
                        maxLength="50"
                        className="form-control"
                        placeholder="Permanent Pin"
                        style={{ textTransform: "capitalize" }}
                        value={fields.permanent_pin_code}
                        onChange={(e) => handleChange(e)}
                      />
                      <div className="errorMsg">
                        {errors.permanent_pin_code}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Current Address:
                      </label>
                      <textarea
                        className="form-control"
                        name="Current_Address"
                        rows="3"
                        cols="35"
                        placeholder="Enter your Local Address"
                        style={{ textTransform: "capitalize" }}
                        value={fields.Current_Address}
                        onChange={(e) => handleChange(e)}
                      ></textarea>
                      <div className="errorMsg">{errors.Current_Address}</div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <div className="form-group">
                      <label className="profile_details_text">
                        Permanent Address
                      </label>
                      <textarea
                        className="form-control"
                        name="Permanent_Address"
                        rows="3"
                        cols="35"
                        placeholder="Enter Your Permanent Address"
                        value={fields.Permanent_Address}
                        onChange={(e) => handleChange(e)}
                      ></textarea>
                      <div className="errorMsg">{errors.Permanent_Address}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <h5 className="text-left">Additional Details</h5>{" "}
            <hr style={{ margin: "0px" }} />
            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <div className="form-group">
                <label className="profile_details_text">Training Days</label>
                <input
                  type="number"
                  name="training_days"
                  className="form-control"
                  placeholder="Training Days"
                  style={{ textTransform: "capitalize" }}
                  value={fields.training_days}
                  onChange={(e) => handleChange(e)}
                />
                <div className="errorMsg">{errors.training_days}</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <div className="form-group">
                <label className="profile_details_text">Notice Period</label>
                <input
                  type="number"
                  name="notice_period"
                  className="form-control"
                  placeholder="Notice Period"
                  style={{ textTransform: "capitalize" }}
                  value={fields.notice_period}
                  onChange={(e) => handleChange(e)}
                />
                <div className="errorMsg">{errors.notice_period}</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <div className="form-group">
                <label className="profile_details_text">CTC</label>
                <input
                  type="number"
                  name="ctc"
                  className="form-control"
                  placeholder="CTC"
                  style={{ textTransform: "capitalize" }}
                  value={fields.ctc}
                  onChange={(e) => handleChange(e)}
                />
                <div className="errorMsg">{errors.ctc}</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <div className="form-group">
                <label className="profile_details_text">Bonus</label>
                <input
                  type="number"
                  name="bonus"
                  className="form-control"
                  placeholder="Bonus"
                  style={{ textTransform: "capitalize" }}
                  value={fields.bonus}
                  onChange={(e) => handleChange(e)}
                />
                <div className="errorMsg">{errors.bonus}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="submit">
              <div className="form-group text-center">
                {props.data ? (
                  <input
                    disabled={submitDisable}
                    type="submit"
                    value="Update"
                    className="col-lg-6 col-md-6 col-sm-6 col-xs-6 my-3 btn btn-success"
                    onClick={(e) => updateUserDetails(e)}
                  />
                ) : (
                  <input
                    disabled={submitDisable}
                    type="submit"
                    value="Submit"
                    className="col-lg-6 col-md-6 col-sm-6 col-xs-6 my-3 btn btn-success"
                    onClick={(e) => submituserRegistrationForm(e)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddEmployee;
