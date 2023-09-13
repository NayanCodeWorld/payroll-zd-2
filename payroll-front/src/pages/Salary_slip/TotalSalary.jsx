import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { utils, write, writeFile } from "xlsx";
import { TiArrowBack } from "react-icons/ti";
import { FaFileDownload } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import DataTable from "react-data-table-component";

import host from "../utils";
import AuthenticateUser from "../../middleWare/AuthenticateUser";

const Years = [2021];
const current = new Date();
const Months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

for (let y = 2021; y <= current.getFullYear(); y++) {
  if (!Years.includes(y)) Years.push(y);
}

function TotalSalary() {
  const navigate = useNavigate();
  const expireAt = localStorage.getItem("expireAt");

  if (AuthenticateUser()) {
    navigate("/");
  }

  const [salaryMonth, setSalaryMonth] = useState(0);
  const [salaryYear, setSalaryYear] = useState(0);
  const [salaryData, setSalaryData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isTableShow, setIsTableShow] = useState(false);

  //function for handling fetching salary Data from DB
  const handleSalaryGenerate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${host}/Emp_Salary/get_allEmp_salary`, {
        month: salaryMonth,
        year: salaryYear,
      })
      .then((res) => {
        const formateData = res.data?.map((item) => ({
          Employee_code: item.Employee_code,
          Employee_name: item.Employee_name,
          Designation: item.designation,
          Salary_Slip_Month: item.Salary_Slip_Month,
          Salary_Slip_Year: item.Salary_Slip_Year,
          Total_Work_Days: item.Total_Work_Days,
          Present_day: item.Present_day,
          Leave_taken: item.Leave_taken,
          Total_paid_day: item.Total_paid_day,
          Total_earn: item.Total_earn,
          Bank_Account_Number: item.Bank_Account_Number,
          Bank_IFSC_Code: item.Bank_IFSC_Code,
        }));
        setIsLoading(false);
        setSalaryData(formateData);
        setIsTableShow(true);
      });
  };

  //Table component Column attribute
  const columns = [
    {
      name: "Employee Code",
      selector: (rowData) => rowData["Employee_code"],
      sortable: true,
      width: "130px",
    },
    {
      name: "Name",
      selector: (rowData) => rowData["Employee_name"],
      sortable: true,
      width: "150px",
      headerStyle: (selector, id) => {
        return { textAlign: "center" };
      },
    },
    {
      name: "Designation",
      selector: (rowData) => rowData["Designation"],
      sortable: true,
    },
    {
      name: "Month",
      selector: (rowData) => rowData["Salary_Slip_Month"],
      sortable: true,
      width: "90px",
    },
    {
      name: "Year",
      selector: (rowData) => rowData["Salary_Slip_Year"],
      sortable: true,
      width: "90px",
    },
    {
      name: "Working Days",
      selector: (rowData) => rowData["Total_Work_Days"],
      sortable: true,
      width: "90px",
    },
    {
      name: "Leaves",
      selector: (rowData) => rowData["Leave_taken"],
      sortable: true,
      width: "90px",
    },
    {
      name: "Present Days",
      selector: (rowData) => rowData["Present_day"],
      sortable: true,
      width: "90px",
    },
    {
      name: "Paid Days",
      selector: (rowData) => rowData["Total_paid_day"],
      sortable: true,
      width: "90px",
    },
    {
      name: "Total Earn",
      selector: (rowData) => rowData["Total_earn"],
      sortable: true,
    },
  ];

  //Select Year and Month Component
  const MonthAndYearSelection = () => (
    <div className="offset-lg-2 col-lg-8">
      <form className="container" onSubmit={handleSalaryGenerate}>
        <div className="card m-5 p-3 ">
          <Link to="/employee/manageprofile">
            <TiArrowBack size={25} />
          </Link>
          <div
            className="card-title"
            style={{
              textAlign: "center",
            }}
          >
            <h2 className="text-red-900">Generate Salary</h2>
          </div>

          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pt-2">
              <div className="form-group">
                <label>Select Year</label>
                <select
                  name="Salary_Year"
                  className="form-control "
                  value={salaryYear}
                  onChange={(e) => setSalaryYear(e.target.value)}
                  required
                >
                  <option selected disabled value={0}>
                    please select an option
                  </option>
                  {Years.map((year) => (
                    <option value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Month</label>
                <select
                  name="Salary_Month"
                  className="form-control "
                  value={salaryMonth}
                  onChange={(e) => setSalaryMonth(e.target.value)}
                  required
                >
                  <option selected disabled value={0}>
                    please select an option
                  </option>
                  {Months.map(
                    (month) =>
                      month.value <= current.getMonth() && (
                        <option value={month.value}>{month.label}</option>
                      )
                  )}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="submit pt-8">
              <div className="form-group">
                <button type="submit" className="btn btn-success">
                  {isLoading ? (
                    <RotatingLines
                      strokeColor="white"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="25"
                      visible={true}
                    />
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );

  //Excel System
  const downloadExcel = () => {
    //to delete extra column from excel document
    const newData = salaryData?.map((row) => {
      delete row.tableData;
      return row;
    });
    //create a worksheet
    const workSheet = utils.json_to_sheet(newData);
    //create a workBook
    const workBook = utils.book_new();
    //append sheet in workbook
    utils.book_append_sheet(workBook, workSheet, "salary");
    //Buffer to increase performance
    let buf = write(workBook, { bookType: "xlsx", type: "buffer" });
    //Binary string
    write(workBook, { bookType: "xlsx", type: "binary" });
    //Download
    writeFile(workBook, `${salaryMonth}_${salaryYear}_salary.xlsx`);
  };

  //Button for Exporting Data into excel
  const actionsMemo = useMemo(
    () => (
      <button
        className="btn btn-primary"
        style={{
          cursor: "pointer",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "15px",
        }}
        type="button"
        onClick={() => downloadExcel()}
      >
        Export <FaFileDownload />
      </button>
    ),
    [salaryData]
  );

  return (
    <div className="pt-5">
      <div>
        {!isTableShow ? (
          <MonthAndYearSelection />
        ) : (
          <div className="offset-lg-1 col-lg-10">
            <DataTable
              title={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h2>Salary</h2>
                  <h6>
                    {Months[salaryMonth].label}, {salaryYear}
                  </h6>
                </div>
              }
              columns={columns}
              data={salaryData}
              pagination
              highlightOnHover
              actions={actionsMemo}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TotalSalary;
