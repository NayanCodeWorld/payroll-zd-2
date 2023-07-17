import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { BsPencilSquare } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { experienceCalculator } from "./experienceCalculator";
import host from "./../utils";
import { TiArrowBack } from "react-icons/ti";
const ManageEmpyee = () => {
  const expireAt = localStorage.getItem('expireAt')
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [empdata, empdatachange] = useState([]);
  const navigate = useNavigate();
  const LoadDetail = (_id) => {
    navigate("/employee/EmpDetail" + _id);
  };
  const generateSalary = (_id) => {
    navigate("/employee/salary" + _id);
  };
  const LoadEdit = (_id) => {
    navigate("/employee/EmpEdit" + _id);
  };
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
        let DOJ;
        let experience;
        let arr = [];
        let finalArr = [];
        for (let i = 0; i < resp.length; i++) {
          arr.push(resp[i]);
        }
        arr.map((e) => {
          experience = experienceCalculator(e.date_of_joining);
          DOJ = new Date(e.date_of_joining).toLocaleDateString("pt-PT");
          finalArr.push({ ...e, DOJ: DOJ, experience: experience });
        });
        empdatachange(finalArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // const employeeCode = (rowData) => rowData["Employee_Code"];

  var columns = [
    {
      name: "Employee Code",
      selector: (rowData) => rowData["Employee_Code"],
      sortable: true,
      width: "150px",                       // added line here
      headerStyle: (selector, id) => {
        return { textAlign: "center" };   // removed partial line here
      },
    },
    {
      name: "Name",
      selector: (rowData) => rowData["First_Name"],
      sortable: true,
      width: "150px",                       // added line here
      headerStyle: (selector, id) => {
        return { textAlign: "center" };   // removed partial line here
      },
    },
    {
      name: "Email",
      selector: (rowData) => rowData["email"],
      sortable: true,
    },
    {
      name: "Phone",
      selector:  (rowData) => rowData["Contact_Number"],
      sortable: true,
    },
    {
      name: "Experience",
      selector: (rowData) => rowData["experience"],
    },
    {
      name: "DOJ",
      selector:(rowData) => rowData["DOJ"],
    },
    {
      name: "Action",
      width: "220px",                       // added line here
      headerStyle: (selector, id) => {
        return { textAlign: "center" };   // removed partial line here
      },
      cell: (row) => (
        <>
          <span
            className="btn btn-md"
            onClick={() => {
              LoadEdit(row._id);
            }}
          >
            <BsPencilSquare />
          </span>
          <span
            className="btn btn-md"
            onClick={() => {
              LoadDetail(row._id);
            }}
          >
            <CgMoreO />
          </span>
          <span
            className="btn btn-sm btn-success"
            style={{ padding: "2px" }}
            onClick={() => {
              generateSalary(row._id);
            }}
          >
          PaySlip
          </span>
        </>
      ),

      ignoreRowClick: true,
    },
  ];
  const filteredData = empdata.filter((row) => {
    return (
      row.First_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.DOJ.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.experience.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Contact_Number.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Employee_Code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  return (
    <div>
       <Link to="/employee/profile" className="btn text-dark">
        <TiArrowBack size={30} />
      </Link>
      <div>
        <div className="ml-5 mr-5">
          <DataTable
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <h4>Employees</h4>{" "}
                  <Link
                    to="/employee/profile"
                    className="btn btn-primary btn-sm ml-5 mr-5"
                  >
                    Add New (+)
                  </Link>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            }
            columns={columns}
            data={filteredData ? filteredData : []}
            pagination
            highlightOnHover
          />
          {/* <table id='example' className="table table-striped table-bordered">
            <thead className="">
              <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Email</td>
                <td>Phone</td>
                <td>Date of joining</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {empdata &&
                empdata.map((item) => (
                  <tr key={item._id}>
                    <td>{item.Employee_Code}</td>
                    <td>{item.First_Name}</td>
                    <td>{item.email}</td>
                    <td>{item.Contact_Number}</td>
                    <td>
                      {item.createdAt}
                    </td>
                    <td>
                      <a
                        onClick={() => {
                          LoadEdit(item._id)
                        }}
                        className="btn btn"
                      >
                        Edit
                      </a>
                      <a
                        onClick={() => {
                          LoadDetail(item._id)
                        }}
                        className="btn btn"
                      >
                        Details
                      </a>
                      <a
                        onClick={() => {
                          generateSalary(item._id)
                        }}
                        className="btn btn"
                      >
                        Receipt
                      </a>
                      <a
                        onClick={() => {
                          generateSalary(item._id)
                        }}
                        className="btn btn"
                      >
                        Receipt
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  );
};

export default ManageEmpyee;
