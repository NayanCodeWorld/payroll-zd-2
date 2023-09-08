import axios from "axios";
import { TiArrowBack } from "react-icons/ti";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import host from "./../utils";

const LEAVE_STATUS = {
  0: "Pending",
  1: "Accepted",
  2: "Rejected",
};

const LEAVE_CREATED_BY = {
  0: "Self",
  1: "Admin",
};

const LEAVE_STATUS_OPTIONS = [0, 1, 2];

function LeaveDetails() {
  const expireAt = localStorage.getItem("expireAt");
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const [empLeaveData, setEmpLeaveData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const deleteLeave = (id) => {
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
        window
          .fetch(`${host}/Emp_Leave/leave_dalete/` + id.id, {
            method: "POST",
          })
          .then((res) => {
            Swal.fire(
              "Deleted!",
              "Your Leave has been deleted.",
              "success"
            ).then(() => {
              window.location.reload(false);
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    });
  };

  const LeaveStatusDropdown = ({ row }) => {
    let optionValue;
    const handleChange = (e) => {
      for (let o in LEAVE_STATUS) {
        if (LEAVE_STATUS[o] === e.target.value) {
          optionValue = o;
        }
      }
      axios
        .put(`${host}/Emp_Leave/leave_update/${row.id}`, {
          leave_status: optionValue,
          user_id: row.user_id,
        })
        .then(window.location.reload(false));
    };
    return (
      <select value={row.leaveStatus} onChange={handleChange}>
        {LEAVE_STATUS_OPTIONS.map((option) => (
          <option key={option} value={LEAVE_STATUS[option]}>
            {LEAVE_STATUS[option]}
          </option>
        ))}
      </select>
    );
  };

  let columns =
    userData.role === "HR"
      ? [
          {
            name: "Name",
            selector: (rowData) => rowData["First_Name"],
            sortable: true,
            width: 30,
          },
          {
            name: "Email",
            selector: (rowData) => rowData["email"],
            sortable: true,
          },
          {
            name: "CreatedAt",
            selector: (rowData) => rowData["createdAt"],
            sortable: true,
          },
          {
            name: "From Date",
            selector: (rowData) => rowData["from_date"],
            sortable: true,
          },
          {
            name: "To Date",
            selector: (rowData) => rowData["to_date"],
            sortable: true,
          },
          {
            name: "Phone",
            selector: (rowData) => rowData["Contact_Number"],
            sortable: true,
          },
          {
            name: "Leave Type",
            selector: (rowData) => rowData["leave_type"],
            sortable: true,
          },
          {
            name: "Reason For Leave",
            selector: (rowData) => rowData["reason_for_leave"],
            sortable: true,
          },
          {
            name: "Leave Status",
            selector: (rowData) => rowData["leaveStatus"],
            cell: (row) => <LeaveStatusDropdown row={row} />,
            sortable: true,
          },
          {
            name: "Created By",
            selector: (rowData) => rowData["createBy"],
          },
          {
            name: "Action",
            cell: (row) => (
              <span
                className="btn btn-md"
                onClick={() => {
                  deleteLeave(row);
                }}
              >
                <FaTrash />
              </span>
            ),

            ignoreRowClick: true,
          },
        ]
      : [
          {
            name: "Name",
            selector: (rowData) => rowData["First_Name"],
            sortable: true,
            width: 30,
          },
          {
            name: "Email",
            selector: (rowData) => rowData["email"],
            sortable: true,
          },
          {
            name: "CreatedAt",
            selector: (rowData) => rowData["createdAt"],
            sortable: true,
          },
          {
            name: "From Date",
            selector: (rowData) => rowData["from_date"],
            sortable: true,
          },
          {
            name: "To Date",
            selector: (rowData) => rowData["to_date"],
            sortable: true,
          },
          {
            name: "Phone",
            selector: (rowData) => rowData["Contact_Number"],
            sortable: true,
          },
          {
            name: "Leave Type",
            selector: (rowData) => rowData["leave_type"],
            sortable: true,
          },
          {
            name: "Reason For Leave",
            selector: (rowData) => rowData["reason_for_leave"],
            sortable: true,
          },
          {
            name: "Leave Status",
            selector: (rowData) => rowData["leaveStatus"],
            sortable: true,
          },
          {
            name: "Created By",
            selector: (rowData) => rowData["createBy"],
          },
          {
            name: "Action",
            cell: (row) => (
              <span
                className="btn btn-md"
                onClick={() => {
                  deleteLeave(row);
                }}
              >
                <FaTrash />
              </span>
            ),

            ignoreRowClick: true,
          },
        ];

  useEffect(() => {
    if (expireAt < Date.now()) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    axios
      .get(`${host}/Emp_Leave/get_leave`)
      .then((response) => {
        // setLeaveStatus(response.leave_status);
        let filteredArr = [];
        let filteredObj = {};
        let responseArr = response.data.msg;
        responseArr.map((e) => {
          e.result.map((w) => {
            filteredObj = {
              First_Name: w.First_Name,
              email: w.email,
              Contact_Number: w.Contact_Number,
            };
          });
          filteredArr.push({
            ...filteredObj,
            user_id: e.userid,
            from_date: new Date(e.from_date).toLocaleDateString("pt-PT"),
            to_date: new Date(e.to_date).toLocaleDateString("pt-PT"),
            leave_type: e.leave_type == 1 ? "Full Day" : "Half Day",
            reason_for_leave: e.reason_for_leave,
            id: e._id,
            createdAt: new Date(e.createdAt).toLocaleDateString("pt-PT"),
            leaveStatus: LEAVE_STATUS[e.leave_status],
            createBy: LEAVE_CREATED_BY[e.create_by],
          });
        });
        setEmpLeaveData(filteredArr);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const filteredData =
    userData.role === "HR"
      ? empLeaveData?.filter((row) => {
          return row.First_Name?.toLowerCase().includes(
            searchTerm?.toLowerCase()
          );
        })
      : empLeaveData?.filter((row) => {
          return (
            row.user_id === userData.id &&
            row.First_Name?.toLowerCase().includes(searchTerm?.toLowerCase())
          );
        });

  return (
    <div>
      {/*<Link to="/employee/manageprofile" className="btn text-dark">
        <TiArrowBack size={30} />
      </Link>*/}
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
                  <h4>Leaves Details</h4>
                  <Link
                    to="/employee/leave"
                    className="btn btn-primary btn-sm ml-5 mr-5"
                  >
                    Add Leave (+)
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
            search
          />
        </div>
      </div>
    </div>
  );
}

export default LeaveDetails;
