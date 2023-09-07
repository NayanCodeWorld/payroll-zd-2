import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import host from "./../utils";

function UserLeaveDetails() {
  const { id } = useParams();
  const [empLeaveData, setEmpLeaveData] = useState([]);
  const deleteLeave = () => {};
  var columns = [
    {
      name: "Name",
      selector: "First_Name",
      sortable: true,
      width: 30,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "createdAt",
      selector: "createdAt",
      sortable: true,
    },
    {
      name: "From Date",
      selector: "from_date",
      sortable: true,
    },
    {
      name: "To Date",
      selector: "to_date",
      sortable: true,
    },
    {
      name: "Phone",
      selector: "Contact_Number",
      sortable: true,
    },
    {
      name: "Leave Type",
      selector: "leave_type",
      sortable: true,
    },
    {
      name: "Reason For Leave",
      selector: "reason_for_leave",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <span
            className="btn btn-md"
            onClick={() => {
              deleteLeave(row);
            }}
          >
            <FaTrash />
          </span>
        </>
      ),

      ignoreRowClick: true,
    },
  ];

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .substring(0, 10);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .substring(0, 10);
  useEffect(() => {
    axios
      .post(
        `${host}/Emp_Leave/get_User_leave/?id=${id}&from_date=${firstDay}&to_date=${lastDay}`
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);
  console.log(id);
  return (
    <div>
      <div>
        <div className="ml-5 mr-5">
          <DataTable
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4>Leaves Details</h4>{" "}
                <Link
                  to="/employee/leave"
                  className="btn btn-primary btn-sm ml-5 mr-5"
                >
                  Add Leave (+)
                </Link>
              </div>
            }
            columns={columns}
            data={empLeaveData ? empLeaveData : []}
            pagination
            highlightOnHover
            search
          />
        </div>
      </div>
    </div>
  );
}

export default UserLeaveDetails;
