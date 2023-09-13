import { useEffect, useState } from "react";
import { HiUserGroup } from "react-icons/hi";
import { MdOutlineEditCalendar, MdDelete } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import emo from "../../../src/components/Sidebar/download.jpeg";
import Swal from "sweetalert2";
import host from "./../utils";
import { TiArrowBack } from "react-icons/ti";
import axios from "axios";

const EmpDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [empdata, empdatachange] = useState({});

  const LoadEdit = () => {
    navigate("/employee/EmpEdit" + id);
  };
  // const leaveNavigate = () => {
  //   navigate("/employee/userleavedetails" + id);
  // };
  useEffect(() => {
    fetch(`${host}/emp/emp_1/` + id)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        empdatachange(resp);
        //console.log(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  // const leaveNavigate = () => {
  //   navigate("/employee/userleavedetails" + id);
  // };
  const img = emo;
  const Removefunction = () => {
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
        axios
          .post(`${host}/emp/update_status`, { id: id, status: 0 })
          .then((res) => {
            Swal.fire(
              "Deleted!",
              "Your file has been deleted.",
              "success"
            ).then(() => {
              navigate("/employee/manageprofile");
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    });
  };

  return (
    <div className="mt-5 ">
      <div className="card">
        {empdata && (
          <div className="cover-content">
            <div
              className="card-title float-end"
              style={{
                marginTop: "-2.5rem",
                color: "rgba(23,31,35,.64)",
              }}
            >
              <div className="flex">
                <div className="flex">
                  <Link
                    to="/employee/manageprofile"
                    className="btn text-primary"
                  >
                    <TiArrowBack size={30} />
                  </Link>
                </div>

                <div className="flex">
                  <button className="btn" onClick={() => LoadEdit()}>
                    <MdOutlineEditCalendar className="text-primary fs-3" />
                  </button>
                  <button className="btn" onClick={() => Removefunction()}>
                    <MdDelete className="text-danger fs-3" />
                  </button>
                </div>
              </div>
              {/* <img alt="Profile-Pic" src={img} style={{ width: '9rem' }} className="profile-pic rounded-circle pmd-z-depth-light-2-1 mr-md-4 mr-4" width="180" /> */}
            </div>
            <div className="container">
              <div className="d-flex d-flex-row align-items-center">
                <div className="media-body">
                  <h1 className="mb-3 mt-5" style={{ color: "#3075BA" }}>
                    {empdata.First_Name + " " + empdata.Last_Name}
                  </h1>
                  <p className=" mb-5">{empdata.Position}</p>
                  <p
                    style={{
                      color: "rgba(23,31,35,.64)",
                    }}
                  ></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {empdata && (
        <div className="card">
          <div className="container mt-3">
            <div className="row view-basic-card">
              <h3
                className="card-title media-body mb-4"
                style={{ color: "#3075BA" }}
              >
                Basic Information
              </h3>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Employee Code</label>
                <p className="pmd-list-title">
                  <small>{empdata.Employee_Code}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">First Name</label>
                <br />
                <small>{empdata.First_Name}</small>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Last Name</label>
                <p className="pmd-list-title">{empdata.Last_Name}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Date of Joinig</label>
                <p className="pmd-list-title">
                  <small>
                    {new Date(empdata.date_of_joining).toLocaleDateString(
                      "pt-PT"
                    )}
                  </small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Personal Email</label>
                <p className="pmd-list-title">
                  <small href="" title="">
                    {empdata.email}
                  </small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Date of Birth</label>
                <p className="pmd-list-title">
                  <small>
                    {new Date(empdata.date_of_birth).toLocaleDateString(
                      "pt-PT"
                    )}
                  </small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Gender</label>
                <p className="pmd-list-title">
                  <small>{empdata.gender}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Marital Status</label>
                <p className="pmd-list-title">
                  <small>{empdata.Marital_Status}</small>
                </p>
              </div>
            </div>
            <hr />
            <div className="row view-basic-card">
              <h3
                className="card-title media-body mb-4"
                style={{ color: "#3075BA" }}
              >
                Effectives
              </h3>
              {empdata.base_salary_list?.map((e) => {
                return (
                  <>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="pmd-list-subtitle">Salary</label>
                      <p className="pmd-list-title">
                        <small>{e.salary_}</small>
                      </p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="pmd-list-subtitle">
                        Effective Date
                      </label>
                      <br />
                      <small>
                        {new Date(e.effective_date).toLocaleDateString("pt-PT")}
                      </small>
                    </div>
                  </>
                );
              })}
            </div>
            <hr />
            <div className="row view-basic-card">
              <h3
                className="card-title media-body mb-4"
                style={{ color: "#3075BA" }}
              >
                Education Details
              </h3>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Degree</label>
                <p className="pmd-list-title">
                  <small>{empdata.DEGREE}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Stream</label>
                <br />
                <small>{empdata.STREAM}</small>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Passed/Appearing</label>
                <p className="pmd-list-title">{empdata.PASSED}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Year of Passing</label>
                <p className="pmd-list-title">
                  <small>{empdata.YEAR_OF_PASSING}</small>
                </p>
              </div>
              {/* <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Date of Joinig</label>
                <p className="pmd-list-title"><small>{new Date(empdata.date_of_joining).toLocaleDateString(
                      "pt-PT"
                    )}</small></p>
              </div> */}
            </div>
            <hr />
            <div className="row view-basic-card">
              <h3
                className="card-title media-body mb-4"
                style={{ color: "#3075BA" }}
              >
                Bank Details
              </h3>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Aadhar Number</label>
                <p className="pmd-list-title">
                  <small>{empdata.ADHAR}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Pan Number</label>
                <br />
                <small>{empdata.PAN_No}</small>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Bank A/C No.</label>
                <p className="pmd-list-title">{empdata.Bank_No}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Bank IFSC Code</label>
                <p className="pmd-list-title">
                  <small>{empdata.Bank_IFSC}</small>
                </p>
              </div>
            </div>
            <hr />
            <div className="row view-basic-card">
              <h3
                className="card-title media-body mb-4"
                style={{ color: "#3075BA" }}
              >
                Contact Details
              </h3>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Contact Number</label>
                <p className="pmd-list-title">
                  <small>{empdata.Contact_Number}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">
                  Alternate Contact No.
                </label>
                <br />
                <small>{empdata.Alternate_Contact_number}</small>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Home Contact No.</label>
                <p className="pmd-list-title">{empdata.Contact_Number_Home}</p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Current City</label>
                <p className="pmd-list-title">
                  <small>{empdata.current_city}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Current State</label>
                <p className="pmd-list-title">
                  <small>{empdata.current_state}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Current Address</label>
                <p className="pmd-list-title">
                  <small>{empdata.Current_Address}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Permanent City</label>
                <p className="pmd-list-title">
                  <small>{empdata.permanent_city}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Permanent State</label>
                <p className="pmd-list-title">
                  <small>{empdata.permanent_state}</small>
                </p>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label className="pmd-list-subtitle">Permanent Address</label>
                <p className="pmd-list-title">
                  <small>{empdata.Permanent_Address}</small>
                </p>
              </div>
            </div>
            <hr />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpDetail;
