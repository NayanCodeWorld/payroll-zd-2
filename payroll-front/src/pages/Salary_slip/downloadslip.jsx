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
          let element = document.getElementById("pdf-download");
          // element.style.display = 'none !important';
          // const opt = {
          //   filename: `${response.Employee_name}.pdf`,
          //   image: { type: 'jpeg', quality: 0.98 },
          //   html2canvas: { scale: 5 },
          //   jsPDF: { format: 'letter', orientation: 'landscape' },
          //   scale: 2
          // };
          // html2pdf().set(opt).from(element).save();
          // html2pdf(element, {
          //   margin: 0,
          //   filename: `${response.Employee_name}_${allMonthsName[response.Salary_Slip_Month - 1]
          //     }.pdf`,
          //   image: { type: "jpeg", quality: 0.98 },
          //   jsPDF: { unit: "in", format: "Tabloid", orientation: "Landscape" },
          // });
        }
      })
      .catch((err) => {
        console.log("Somthing Went Wrong", err);
      });
  }, []);



  const Pdfdownload = () => {
    // let upLinkElement = document.getElementById("up_link_head");
    // if (upLinkElement) {
    //   upLinkElement.style.transform = 'translate(0px, -12px)';
    // }
    let element = document.getElementById("pdf-download");
    const opt = {
      // margin: [10, 10, 10, 10], // Set all margins to 0
      filename: `${fields.Employee_name}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 5 },
      jsPDF: { format: 'letter', orientation: 'landscape' },
      scale: 5
    };
    html2pdf().set(opt).from(element).save();
  };



  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    let newDate = `${day}-${month}-${year}`;
    return newDate;
  };

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
      <div className="btn float-end text-primary">
        <MdDownload onClick={Pdfdownload} size={30} />
      </div>
      <TiArrowBack onClick={() => { navigate("/employee/manageprofile") }} size={30} />
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
        // style={{
        // visibility: 'hidden'
        // }}
        >
          <div className="border border-dark main-element"
            id="for_hide"
            style={{
              fontFamily: 'revert',
              width: "70%",
            }}
          >
            <div className=" text-center">
              <div className="fw-bold border-bottom border-dark d-grid up_link" style={{ color: "rgb(18 82 162)" }}>
                <small  style={{ fontSize: '20px', fontFamily: 'cambria' }}>ZECDATA</small>
                <small  style={{ fontSize: '12px', fontFamily: 'cambria', marginBottom: '4px' }}>INDORE(MP)</small>
              </div>
              <h6 className="fw-bolder up_link" style={{ color: "rgb(18 82 162)" }}>
                Pay Slip For The Month Of
                {" " + allMonthsName[fields.Salary_Slip_Month - 1]} {fields.Salary_Slip_Year}
              </h6>
            </div>
            <div
              className="text-white d-flex "
              style={{ backgroundColor: "rgb(77 137 202)" }}
            >

              <div className="col-md-6 ml-1" style={{ fontFamily: 'cambria' }}>
                <div className="d-flex">
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">Name </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-md-7">
                    <small className="fw-bolder up_link">{fields.Employee_name.toUpperCase()}</small>
                  </div>
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">Employee Code. </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">{fields.Employee_code}</small>
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
                    <small className="fw-bolder up_link">{fields.designation}</small>
                  </div>
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">Employee Code. </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-md-5">
                    <small className="fw-bolder up_link">{fields.Employee_code}</small>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="col-5">
                    <small className="fw-bolder up_link">Date of Joining </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-7">
                    <small className="fw-bolder up_link">{formatDate(fields.Date_of_Joining?.substring(0, 10))}</small>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">IFSC</small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">
                      {fields.Bank_IFSC_Code}
                    </small>
                  </div>
                </div>

                <div className="border-bottom border-dark mr-2" style={{ width: '200%', marginLeft: '-0.25rem' }}></div>

                <div className="d-flex">
                  <div className="col-5">
                    <small className="fw-bolder up_link">Leave (Balance) </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-7">
                    <small className="fw-bolder up_link">{fields.Leave_balence}</small>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">Total Working Days</small>
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
                    <small className="fw-bolder up_link">Leave Taken </small>
                  </div>
                  <div className="col-1">
                    <span className="fw-bolder up_link"> : </span>
                  </div>
                  <div className="col-7">
                    <small className="fw-bolder up_link">{fields.Leave_balence}</small>
                  </div>
                  <div className="col-5">
                    <small className="fw-bolder up_link">Present Dayss</small>
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
                    <small className="fw-bolder up_link">{fields.Balence_days}</small>
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
            <table className="table table-bordered  border-dark m-0 " style={{ borderLeft: 'hidden', borderRight: 'hidden' }}>
              <thead>
                <tr style={{ color: "#19536f" }}>
                  <th scope="col"><th className="up_link">Gross</th></th>
                  <th scope="col"><th className="up_link">Amount</th></th>
                  <th scope="col"><th className="up_link">Earning</th></th>
                  <th scope="col"><th className="up_link">Amount</th></th>
                  <th scope="col"><th className="up_link">Deduction</th></th>
                  <th scope="col"><th className="up_link">Amount</th></th>
                </tr>
              </thead>
              <tbody style={{ color: "#19536f" }}>
                <tr>
                  <th scope="row"><th className="up_link">Basic & DA</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Gross_Basic_DA}</td></td>
                  <th scope="row"><th className="up_link">Basic & DA</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Earned_Basic_DA}</td></td>
                  <th className="fw-bolder"><th className="up_link">PF</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">0</td></td>
                </tr>
                <tr>
                  <th scope="row"><th className="up_link">HRA</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Gross_HRA}</td></td>
                  <th scope="row"><th className="up_link">HRA</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Earned_HRA}</td></td>
                  <th className="fw-bolder"><th className="up_link">Professional tax</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">0</td></td>
                </tr>
                <tr>
                  <th scope="row"><th className="up_link">RA</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Gross_RA}</td></td>
                  <th scope="row"><th className="up_link">RA</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Earned_RA}</td></td>
                  <th className="fw-bolder"><th className="up_link">TDS</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">0</td></td>
                </tr>
                <tr>
                  <th scope="row"><th className="up_link">FLEXI Benefits</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Gross_Flext_benefits}</td></td>
                  <th scope="row"> <th className="up_link">FLEXI Benefits</th></th>
                  <td className="fw-bolder  float-right border-0"> <td className="up_link">{fields.Earned_Flext_benefits}</td></td>
                  <th className="fw-bolder"> <th className="up_link">ARRS</th></th>
                  <td className="fw-bolder  float-right border-0"> <td className="up_link">{fields.ARRS}</td></td>
                </tr>
                <tr
                  style={{ backgroundColor: "rgb(77 137 202)", color: "white" }}
                >
                  <th scope="row"><th className="up_link">Total Gross</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Gross_total}</td></td>
                  <th> <th className="up_link">Total Earn</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Total_earn}</td></td>
                  <th> <th className="up_link">Additional</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">{fields.Additional}</td></td>
                </tr>
                <tr
                  style={{ backgroundColor: "rgb(77 137 202)", color: "white" }}
                >
                  <th scope="row"> <th className="up_link">Net Pay</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">&#8377;{fields.Net_pay_in_number}</td></td>
                  <td></td>
                  <td></td>
                  <th> <th className="up_link">Total Deduction</th></th>
                  <td className="fw-bolder  float-right border-0"><td className="up_link">0</td></td>
                </tr>
              </tbody>
            </table>
            <div className="border-bottom border-dark d-flex " style={{ borderLeft: 'hidden', borderRight: 'hidden' }}>

              <div className="col-md-4">
                <div className="d-flex fw-bolder">
                  <small className="fw-bolder up_link" style={{ color: "rgb(18 82 162)" }} >
                    NET SALARY PAYABLE(IN WORDS)
                  </small>
                </div>
              </div>

              <div className="border-start border-dark" style={{ marginLeft: '-5px' }}></div>
              <div className=" col-md-8">

                <div className="d-flex ml-1 fw-bolder">
                  <small className="fw-bolder up_link" style={{ color: "rgb(18 82 162)", fontWeight: "bold" }}>
                    {fields.Net_pay_in_words.toUpperCase()} ONLY
                  </small>
                  <br></br>
                </div>

              </div>

            </div>
            <span className="col-md-12 fw-bolder up_link ml-1" style={{ color: "rgb(18 82 162)" }}>
              *This is computer generated copy not need to stamp and sign
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
export default Downloadslip;