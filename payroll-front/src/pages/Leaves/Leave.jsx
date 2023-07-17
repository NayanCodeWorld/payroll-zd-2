import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import host from "./../utils";
import Select from 'react-select';
import { leaveValidateForm } from "./leaveValidation";

const Leaves = () => {
  let navigate = useNavigate();
  const expireAt = localStorage.getItem('expireAt')
  const toDateInputRef = useRef(null);
  const [leavesData, setLeavesData] = useState({});
  const [users, setUsers] = useState([]);
  const [Doj, setDoj] = useState([]);
  const [submitDisable, setSubmitDisable] = useState(false);

  const [disableToDate, setDisableToDate] = useState(true);
  const [errors, setErrors] = useState({});
  var leavesObj = {}
  const handleChange = (e) => {
    leavesObj = { ...leavesData };
    leavesObj[e.target.name] = e.target.value;
    if (leavesObj.from_date) {
      setDisableToDate(false);
      if (toDateInputRef.current) {
        const today = new Date(leavesObj.from_date).toISOString().split("T")[0];
        toDateInputRef.current.setAttribute("min", today);
      }
    }
    setLeavesData(leavesObj);
  };
  const handleSelectChange = (e) => {
   const doj = (e.option?.substring(0, 10))
   setDoj(doj);
    leavesObj = { ...leavesData, userid: e.value };
    setLeavesData(leavesObj);
  }

  console.log("leavesData", leavesData);

  useEffect(() => {
    if(expireAt < Date.now()){
      localStorage.removeItem('token')
      window.location.reload()
    }
    window
      .fetch(`${host}/emp/get_employ`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        console.log("res", resp);
        setUsers(resp);
        // setDoj(resp)
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const notify = (message) => {
    toast(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  // new Date(e.date_of_joining).toLocaleDateString('pt-PT')
  const handlesubmit = (e) => {
    e.preventDefault();
    const validationErrors = leaveValidateForm(leavesData)
    console.log('validationErrors',validationErrors);
    setErrors(validationErrors.errObj);
    if (validationErrors && validationErrors.formIsValid) {
      setSubmitDisable(true);
    axios
      .post(`${host}/Emp_Leave/leave`, leavesData)
      .then((response) => {
        console.log("success", response.data.success);
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: "Leave Added Successfully!",
          }).then(() => {
            navigate("/employee/leavedetails");
          });
        } else {
          notify(response.data.message);
          setSubmitDisable(false);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    }
  };
  const selectOptions = users.map(option => ({ value: option._id, label: `${option.First_Name} - ${option.Employee_Code}`  ,option:option.date_of_joining}));

//   const dojOptions = Doj.map(dojoption => ({ dateOfBirth: dojoption.Date_of_Joining}));
// console.log('dojOptions',dojOptions);
 

  return (
    <div>
      <div className="offset-lg-2 col-lg-8">
        <ToastContainer />
        <form className="container" onSubmit={handlesubmit}>
          <div className="card m-5 p-3">
            <Link to="/employee/leavedetails">
              <TiArrowBack size={25} />
            </Link>
            <div className="card-title" style={{ textAlign: "center" }}>
              <h2 className="text-red-900">Apply Leave</h2>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="profile_details_text">
                    Select Employee Name
                  </label>
                  <Select
                    options={selectOptions}
                    isSearchable={true}
                    placeholder="Select Employee"
                    onChange={(e) => handleSelectChange(e)}
                  />
                  <div className="errorMsg">{errors.userid}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div className="form-group">
                  <label>From Date</label>
                  <input
                    min={Doj}
                    type="date"
                    name="from_date"
                    value={leavesData.from_date}
                    onChange={(e) => handleChange(e)}
                    className="form-control"
                  ></input>
                  <div className="errorMsg">{errors.from_date}</div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div className="form-group">
                  <label>To Date</label>
                  <input
                    ref={toDateInputRef}
                    disabled={disableToDate}
                    type="date"
                    name="to_date"
                    value={leavesData.to_date}
                    onChange={(e) => handleChange(e)}
                    className="form-control"
                  ></input>
                  <div className="errorMsg">{errors.to_date}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div className="form-group">
                  <label className="profile_details_text">Reason</label>
                  <select
                    name="reason_for_leave"
                    className="form-control"
                    value={leavesData.reason_for_leave}
                    onChange={(e) => handleChange(e)}
                    placeholder="Leave Reason"
                  >
                    <option disabled={true} selected={true}>
                      Reason
                    </option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Compensatory Leave</option>
                  </select>
                  <div className="errorMsg">{errors.reason_for_leave}</div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div className="form-group">
                  <label className="profile_details_text">Leave Type</label>
                  <select
                    name="leave_type"
                    className="form-control"
                    value={leavesData.leave_type}
                    onChange={(e) => handleChange(e)}
                    placeholder="Leave Type"
                  >
                    <option disabled={true} selected={true}>
                      Leave Type
                    </option>
                    <option value="full">Full Day</option>
                    <option value="half">Half Day</option>
                  </select>
                  <div className="errorMsg">{errors.leave_type}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="submit pt-8">
                <div className="form-group">
                  <input
                    disabled={submitDisable}
                    type="submit"
                    value="Add"
                    className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-success"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Leaves;
