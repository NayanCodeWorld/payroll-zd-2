import React from "react";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { RotatingLines } from "react-loader-spinner";
import { TiArrowBack } from "react-icons/ti";
import { MdDownload } from "react-icons/md";
import host from "../utils";
import { CSVLink } from "react-csv";
import AuthenticateUser from "../../middleWare/AuthenticateUser";

const Downloadslip = () => {
  const navigate = useNavigate();

  if (AuthenticateUser()) {
    navigate("/");
  }

  let location = useLocation();
  const salaryYear = location.state?.salaryYear ?? 0;
  const salaryMonthNumber = location.state?.salaryMonthNumber ?? 0;
  const data = location.state.fields;
  const expireAt = localStorage.getItem("expireAt");

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [fields, setFields] = useState({});

  const allMonthsName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (expireAt < Date.now()) {
          localStorage.removeItem("token");
          window.location.reload();
        }

        const response = await axios.post(
          `${host}/Emp_Salary/salary_?userid=${id}&year=${salaryYear}&month=${salaryMonthNumber}`,
          data
        );

        console.log(response);

        if (response.status === 200) {
          setFields(response.data.salary);
        } else {
          console.log("Something Went Wrong");
        }
      } catch (error) {
        console.log("Something Went Wrong", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [salaryYear, salaryMonthNumber, data]);

  // useEffect(() => {
  //   if (!isLoading && fields) {
  //     const element = document.getElementById("pdf-download");
  //     if (element) {
  //       const opt = {
  //         margin: 0,
  //         filename: `${fields.Employee_name}.pdf`,
  //         image: { type: "jpeg", quality: 0.98 },
  //         html2canvas: { scale: 5 },
  //         jsPDF: { format: "letter", orientation: "landscape" },
  //         scale: 2,
  //       };

  //       html2pdf().set(opt).from(element).save();
  //     }
  //   }
  // }, [isLoading, fields]);

  const Pdfdownload = () => {
    let element = document.getElementById("pdf-download");
    const opt = {
      filename: `${fields.Employee_name}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5 },
      jsPDF: { format: "letter", orientation: "landscape" },
      scale: 5,
    };
    html2pdf().set(opt).from(element).save();
  };

  const formatDate = (dateStr) => {
    console.log("dateStr", dateStr);
    const [year, month, day] = dateStr.split("-");
    const dateArr = dateStr.split("-");
    console.log("DateArr", dateArr);
    let newDate = `${day}-${month}-${year}`;
    return newDate;
  };

  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

  return (
    <div>
      <style>
        {`
          .table>:not(caption)>*>* {
            padding: 0px 4px !important;
          }
          .up_link {
            transform: translate(0px, -7px);
          }
          `}
      </style>

      <div className="btn float-end text-primary d-flex ">
        <MdDownload onClick={Pdfdownload} size={30} />
        <CSVLink
          data={csvData}
          filename="RegisterUserData.csv"
          className="btn btn-success ml-3"
        >
          Export Slip
        </CSVLink>
      </div>
      {/*<TiArrowBack
        onClick={() => {
          navigate("/employee/manageprofile");
        }}
        size={30}
      />*/}
      {isLoading ? (
        <RotatingLines
          className="text-center"
          strokeColor="black"
          strokeWidth="8"
          animationDuration="0.75"
          width="26"
          visible={true}
        />
      ) : (
        <div
          className="d-flex mt-5 container justify-content-center"
          id="pdf-download"
        >
          <div
            className="border border-dark main-element"
            id="for_hide"
            style={{
              fontFamily: "revert",
              width: "70%",
            }}
          >
            <div className=" text-center">
              <div
                className="fw-bold border-bottom border-dark d-grid up_link pt-3"
                style={{ color: "rgb(18 82 162)" }}
              >
                <small
                  className="up_link"
                  style={{ fontSize: "20px", fontFamily: "cambria" }}
                >
                  ZECDATA
                </small>
                <small
                  className="up_link"
                  style={{
                    fontSize: "12px",
                    fontFamily: "cambria",
                    marginBottom: "4px",
                  }}
                >
                  INDORE(M.P.)
                </small>
              </div>
              <h6
                className="fw-bolder up_link pt-3"
                style={{ color: "rgb(18 82 162)" }}
              >
                Pay Slip For The Month Of
                {" " + allMonthsName[fields.Salary_Slip_Month - 1]}{" "}
                {fields.Salary_Slip_Year}
              </h6>
            </div>
            <div
              className="text-white d-flex "
              style={{
                backgroundColor: "rgb(77 137 202)",
                borderTop: "1px solid black",
              }}
            >
              <div className="col-md-6 ml-1" style={{ fontFamily: "cambria" }}>
                <div className="d-flex">
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">Name </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-md-7">
                    <small className="fw-bolder up_link">
                      {fields?.Employee_name?.toUpperCase()}
                    </small>
                  </div>
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">Employee Code. </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">
                      {fields.Employee_code}
                    </small>
                  </div>
                </div>
                <div className="d-flex ">
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">Designation </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-md-7">
                    <small className="fw-bolder up_link">
                      {fields.designation}
                    </small>
                  </div>
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">Bank A/c No. </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-md-5">
                    <small
                      className="fw-bolder up_link"
                      style={{ fontSize: "16px" }}
                    >
                      {fields.Bank_Account_Number}
                    </small>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-5">
                    <small className="fw-bolder up_link">DOJ </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-7">
                    <small className="fw-bolder up_link">
                      {formatDate(fields?.Date_of_Joining?.substring(0, 10))}
                    </small>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">IFSC</small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-5">
                    <small
                      className="fw-bolder up_link"
                      style={{ fontSize: "16px" }}
                    >
                      {fields.Bank_IFSC_Code}
                    </small>
                  </div>
                </div>

                <div
                  className="border-bottom border-dark mr-2"
                  style={{ width: "200%", marginLeft: "-0.25rem" }}
                ></div>

                <div className="d-flex">
                  <div className="col-5">
                    <small className="fw-bolder up_link">
                      Leave (balance){" "}
                    </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-7">
                    <small className="fw-bolder up_link">
                      {fields.Leave_balence}
                    </small>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">
                      Total Working Days
                    </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">
                      {fields.Total_Work_Days}
                    </small>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="col-5">
                    <small className="fw-bolder up_link">Leaves taken </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-7">
                    <small className="fw-bolder up_link">
                      {fields.Leave_taken}
                    </small>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">Present Days</small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">
                      {fields.Present_day}
                    </small>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="col-5">
                    <small className="fw-bolder up_link">Balance Days </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-7">
                    <small className="fw-bolder up_link">
                      {fields.Balence_days}
                    </small>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">Total Paid Days</small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">
                      {fields.Total_paid_day}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <table
              className="table table-bordered  border-dark m-0 "
              style={{ borderLeft: "hidden", borderRight: "hidden" }}
            >
              <thead>
                <tr style={{ color: "#19536f" }}>
                  <th scope="col">
                    <th className="up_link pt-2 pb-0">Gross</th>
                  </th>
                  <th scope="col">
                    <th className="up_link pt-2 pb-0">Amount</th>
                  </th>
                  <th scope="col">
                    <th className="up_link pt-2 pb-0">Earning</th>
                  </th>
                  <th scope="col">
                    <th className="up_link pt-2 pb-0">Amount</th>
                  </th>
                  <th scope="col">
                    <th className="up_link pt-2 pb-0">Deduction</th>
                  </th>
                  <th scope="col">
                    <th className="up_link pt-2 pb-0">Amount</th>
                  </th>
                </tr>
              </thead>
              <tbody style={{ color: "#19536f" }}>
                <tr>
                  <th scope="row">
                    <th className="up_link pt-2 pb-0">Basic & DA</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">
                      {fields.Gross_Basic_DA}
                    </td>
                  </td>
                  <th scope="row">
                    <th className="up_link pt-2 pb-0">Basic & DA</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">
                      {fields.Earned_Basic_DA}
                    </td>
                  </td>
                  <th className="fw-bolder">
                    <th className="up_link pt-2 pb-0">PF</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">0</td>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <th className="up_link pt-2 pb-0">HRA</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">{fields.Gross_HRA}</td>
                  </td>
                  <th scope="row">
                    <th className="up_link pt-2 pb-0">HRA</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">{fields.Earned_HRA}</td>
                  </td>
                  <th className="fw-bolder">
                    <th className="up_link pt-2 pb-0">Professional Tax</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">0</td>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <th className="up_link pt-2 pb-0">RA</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">{fields.Gross_RA}</td>
                  </td>
                  <th scope="row">
                    <th className="up_link pt-2 pb-0">RA</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">{fields.Earned_RA}</td>
                  </td>
                  <th className="fw-bolder">
                    <th className="up_link pt-2 pb-0">TDS</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">0</td>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <th className="up_link pt-2 pb-0">Flexi Benefits</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">
                      {fields.Gross_Flext_benefits}
                    </td>
                  </td>
                  <th scope="row">
                    {" "}
                    <th className="up_link pt-2 pb-0">Flexi Benefits</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    {" "}
                    <td className="up_link pt-2 pb-0">
                      {fields.Earned_Flext_benefits}
                    </td>
                  </td>
                  <th className="fw-bolder">
                    {" "}
                    <th className="up_link pt-2 pb-0">
                      {fields.ARRS ? "ARRS" : fields.Bonus ? "Bonus" : "ECIS"}
                    </th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    {" "}
                    <td className="up_link pt-2 pb-0">
                      {fields.ARRS
                        ? fields.ARRS
                        : fields.Bonus
                        ? fields.Bonus
                        : fields.ECSI}
                    </td>
                  </td>
                </tr>
                <tr
                  style={{ backgroundColor: "rgb(77 137 202)", color: "white" }}
                >
                  <th scope="row">
                    <th className="up_link pt-2 pb-0">Total Gross</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">{fields.Gross_total}</td>
                  </td>
                  <th>
                    {" "}
                    <th className="up_link pt-2 pb-0">Total Earn</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">{fields.Total_earn}</td>
                  </td>
                  <th>
                    {" "}
                    <th className="up_link pt-2 pb-0">Additional</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">{fields.Additional}</td>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <th className="up_link pt-2 pb-0"></th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0"></td>
                  </td>
                  <th>
                    {" "}
                    <th className="up_link pt-2 pb-0"></th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0"></td>
                  </td>
                  <th>
                    {" "}
                    <th
                      className="up_link pt-2 pb-0"
                      style={{ visibility: "hidden" }}
                    >
                      Additional
                    </th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0"></td>
                  </td>
                </tr>
                <tr
                  style={{ backgroundColor: "rgb(77 137 202)", color: "white" }}
                >
                  <th scope="row">
                    {" "}
                    <th className="up_link pt-2 pb-0">Net pay</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">
                      &#8377;{fields.Net_pay_in_number}
                    </td>
                  </td>
                  <td></td>
                  <td></td>
                  <th>
                    {" "}
                    <th className="up_link pt-2 pb-0">Total Deduction</th>
                  </th>
                  <td className="fw-bolder  float-right border-0">
                    <td className="up_link pt-2 pb-0">0</td>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              className="border-bottom border-dark d-flex "
              style={{ borderLeft: "hidden", borderRight: "hidden" }}
            >
              <div className="col-md-4 pt-2 pb-0">
                <div className="d-flex fw-bolder">
                  <small
                    className="fw-bolder up_link ml-3"
                    style={{ color: "rgb(18 82 162)" }}
                  >
                    Net Salary Payable (In Word) :
                  </small>
                </div>
              </div>

              <div
                className="border-start border-dark"
                style={{ marginLeft: "-8px" }}
              ></div>
              <div className=" col-md-8 pt-2 pb-0">
                <div className="d-flex ml-1 fw-bolder">
                  <small
                    className="fw-bolder up_link"
                    style={{ color: "rgb(18 82 162)", fontWeight: "bold" }}
                  >
                    {fields.Net_pay_in_words?.toUpperCase()} ONLY
                  </small>
                  <br></br>
                </div>
              </div>
            </div>
            <span
              className="col-md-12 up_link ml-1"
              style={{ color: "rgb(18 82 162)", fontSize: "14px" }}
            >
              *This is computer generated copy not need to stamp and sign
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default Downloadslip;
