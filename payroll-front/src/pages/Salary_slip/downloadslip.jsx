import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { RotatingLines } from "react-loader-spinner";
import { TiArrowBack } from "react-icons/ti";
import { MdDownload } from "react-icons/md";
import host from "../utils";

const Downloadslip = () => {
  let location = useLocation();
  const salaryYear = Number(location.state.salaryYear);
  const salaryMonthNumber = Number(location.state.salaryMonthNumber);
  const data = location.state.fields;
  console.log(data, 'data');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [fields, setFields] = useState({});
  var allMonthsName = [
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
    axios
      .post(
        `${host}/Emp_Salary/salary_?userid=${id}&year=${salaryYear}&month=${salaryMonthNumber}`,
        data
      )
      .then((response) => {
        console.log("response", response.data);
        if (response.data.success) {
          setFields(response.data.salary);
          console.log(response.data.salary, '11111111111111111111');
          setIsLoading(false);
          return response.data.salary;
        } else {
          setFields(response.data);
          setIsLoading(false);
          return response.data;
        }
      })
      .then((response) => {
        if (response) {
          console.log("reponse", response);
          const element = document.getElementById("pdf-download");
          html2pdf(element, {
            margin: 0,
            filename: `${response.Employee_name}_${allMonthsName[response.Salary_Slip_Month - 1]
              }.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 5 },
            jsPDF: { unit: "in", format: "Tabloid", orientation: "Landscape" },
          });
        }
      })
      .catch((err) => {
        console.log("Somthing Went Wrong", err);
      });
  }, []);

  console.log('fields', fields);
  const Pdfdownload = () => {
    const element = document.getElementById("pdf-download");
    html2pdf(element, {
      margin: 0,
      filename: `${fields.Employee_name}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "Tabloid", orientation: "Landscape" },
    });
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    let newDate = `${day}-${month}-${year}`;
    return newDate;
  };

  return (
    <div>
      <div className="btn float-end text-primary">
        <MdDownload onClick={Pdfdownload} size={30} />
      </div>
      <TiArrowBack onClick={() => { navigate("/employee/manageprofile") }} size={30} />
      <div
        className="d-flex mt-1 container"
        id="pdf-download"
        style={{ justifyContent: "center" }}
      >
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
            style={{
              border: "1px solid black",
              width: "60%",
              height: '41rem'
            }}
          >
            <div className="text-center">
              <h3 className="fw-bold" style={{ color: "#3d85c6" }}>
                ZecData
              </h3>
              <h5 className="fw-bold text-dark h-8">
                Payment slip for the month of
                {" " + allMonthsName[fields.Salary_Slip_Month - 1]} {fields.Salary_Slip_Year}
              </h5>
            </div>

            <div
              className="text-white d-flex h-40"
              style={{ backgroundColor: "#3d85c6" }}
            >
              <div className="col-md-6">


                <div className="border-bottom h-20">
                  <div className="d-flex ml-5">
                    <div className="col-md-5">
                      <span className="fw-bolder">Name </span>
                    </div>
                    <div className="col-md-7">
                      <small>{fields.Employee_name.toUpperCase()}</small>
                    </div>
                  </div>
                  <div className="d-flex ml-5">
                    <div className="col-md-5">
                      <span className="fw-bolder">Designation </span>
                    </div>
                    <div className="col-md-7">
                      <small>{fields.designation}</small>
                    </div>
                  </div>
                  <div className="d-flex ml-5">
                    <div className="col-md-5">
                      <span className="fw-bolder ">Date of Joining</span>
                    </div>
                    <div className="col-md-5">
                      <small >
                        {formatDate(fields.Date_of_Joining?.substring(0, 10))}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="d-flex ml-5">
                  <div className="col-md-5">
                    <span className="fw-bolder">Leave (Balance)</span>
                  </div>
                  <div className="col-md-5">
                    <span className="fw-bolder">{fields.Leave_balence}</span>
                  </div>
                </div>
                <div className="d-flex ml-5">
                  <div className="col-md-5">
                    <span className="fw-bolder">Leave Taken </span>
                  </div>
                  <div className="col-md-5">
                    <span className="fw-bolder">{fields.Leave_taken}</span>
                  </div>
                </div>
                <div className="d-flex ml-5">
                  <div className="col-md-5">
                    <span className="fw-bolder">Balance Days</span>
                  </div>
                  <div className="col-md-5">
                    <span className="fw-bolder">{fields.Balence_days}</span>
                  </div>
                </div>
              </div>

              <div className="col-md-6">

                <div className="border-bottom h-20">
                  <div className="d-flex ml-5">
                    <div className="col-md-6">
                      <span className="fw-bolder">Employee Code. </span>
                    </div>
                    <div className="col-md-6">
                      <small className="fw-bolder">{fields.Employee_code}</small>
                    </div>
                  </div>
                  <div className="d-flex ml-5">
                    <div className="col-md-6">
                      <span className="fw-bolder">Bank A/c No. </span>
                    </div>
                    <div className="col-md-6">
                      <sapn className="fw-bolder">{fields.Bank_Account_Number}</sapn>
                    </div>
                  </div>
                  <div className="d-flex ml-5">
                    <div className="col-md-6">
                      <span className="fw-bolder">IFSC </span>
                    </div>
                    <div className="col-md-6">
                      <sapn className="fw-bolder">{fields.Bank_IFSC_Code}</sapn>
                    </div>
                  </div>
                </div>


                <div className="d-flex ml-5">
                  <div className="col-md-6">
                    <span className="fw-bolder">Total Working Days</span>
                  </div>
                  <div className="col-md-6">
                    <small>{fields.Total_Work_Days}</small>
                  </div>
                </div>
                <div className="d-flex ml-5">
                  <div className="col-md-6">
                    <span className="fw-bolder ">Present Days</span>
                  </div>
                  <div className="col-md-6">
                    <small>{fields.Present_day}</small>
                  </div>
                </div>
                <div className="d-flex ml-5">
                  <div className="col-md-6">
                    <span className="fw-bolder">Total Paid Days</span>
                  </div>
                  <div className="col-md-6">
                    <small>{fields.Total_paid_day}</small>
                  </div>
                </div>
              </div>

            </div>

            <table className="table table-bordered  border-dark m-0" style={{ borderLeft: 'hidden', borderRight: 'hidden' }}>
              <thead>
                <tr style={{ color: "#19536f" }}>
                  <th scope="col">Gross</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Earning</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Deduction</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody style={{ color: "#19536f" }}>
                <tr>
                  <th scope="row">Basic & DA</th>
                  <td>{fields.Gross_Basic_DA}</td>
                  <th scope="row">Basic & DA</th>
                  <td>{fields.Earned_Basic_DA}</td>
                  <td>PF</td>
                  <td>0</td>
                </tr>
                <tr>
                  <th scope="row">HRA</th>
                  <td>{fields.Gross_HRA}</td>
                  <th scope="row">HRA</th>
                  <td>{fields.Earned_HRA}</td>
                  <td>Professional tax</td>
                  <td>0</td>
                </tr>
                <tr>
                  <th scope="row">RA</th>
                  <td>{fields.Gross_RA}</td>
                  <th scope="row">RA</th>
                  <td>{fields.Earned_RA}</td>
                  <td>TDS</td>
                  <td>0</td>
                </tr>
                <tr>
                  <th scope="row">FLEXI Benefits</th>
                  <td>{fields.Gross_Flext_benefits}</td>
                  <th scope="row">FLEXI Benefits</th>
                  <td>{fields.Earned_Flext_benefits}</td>
                  {fields.ARRS != 0 ? (
                    <>
                      <td>ARRS</td>
                      <td>{fields.ARRS}</td>
                    </>
                  ) : fields.Bonus != 0 ? (
                    <>
                      <td>Bonus</td>
                      <td>{fields.Bonus}</td>
                    </>
                  ) : (
                    <>
                      <td>ECSI</td>
                      <td>{fields.ECSI}</td>
                    </>
                  )}
                  
                </tr>
                <tr
                  style={{ backgroundColor: "#3d85c6", color: "white" }}
                >
                  <th scope="row">Total Gross</th>
                  <td>{fields.Gross_total}</td>
                  <th>Total Earn</th>
                  <td>{fields.Total_earn}</td>
                  <th>Additional</th>
                  <td>{fields.Additional}</td>
                </tr>
                <tr>
                  <th scope="row"></th>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr
                  style={{ backgroundColor: "#3d85c6", color: "white" }}
                >
                  <th scope="row">Net Pay</th>
                  <td>{fields.Net_pay_in_number}</td>
                  <td></td>
                  <td></td>
                  <th>Total Deduction</th>
                  <td>0</td>
                </tr>
              </tbody>
            </table>

            <div className="border border-dark d-flex " style={{ borderLeft: 'hidden', borderRight: 'hidden' }}>
              <div className="col-md-4 mt-2.5">
                <small style={{ color: "#3d85c6", fontWeight: "bold" }} >
                  Net Salary Payable(In Words)
                </small>
              </div>
              <div className="border-start border-dark"></div>
              <div className=" col-md-8 mt-2.5">
                <div className="d-flex flex-column ml-1">
                  <small style={{ color: "#3d85c6", fontWeight: "bold" }}>
                    {fields.Net_pay_in_words.toUpperCase()} ONLY
                  </small>
                  <br></br>
                </div>
              </div>
            </div>
            <span className="col-md-12" style={{ color: "#3d85c6" }}>
              *This is computer generated copy not need to stamp and sign
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
export default Downloadslip;