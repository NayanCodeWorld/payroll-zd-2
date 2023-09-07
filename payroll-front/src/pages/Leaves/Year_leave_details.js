import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { TiArrowBack } from "react-icons/ti";
import host from "./../utils";

function Year_Leave_Details() {
  const expireAt = localStorage.getItem("expireAt");
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  const { id } = useParams();
  const [empLeaveData, setEmpLeaveData] = useState([]);

  var columns =
    userData?.role === "HR"
      ? [
          {
            name: "Year",
            selector: (rowData) => rowData["year"],
            sortable: true,
            width: 30,
          },
          {
            name: "Year_Leave",
            selector: (rowData) => rowData["leave"],
            sortable: true,
          },
          {
            name: "Action",
            cell: (row) => (
              <span
                className="btn btn-md"
                onClick={() => {
                  deleteYearleave(row);
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
            name: "Year",
            selector: (rowData) => rowData["year"],
            sortable: true,
            width: 30,
          },
          {
            name: "Year_Leave",
            selector: (rowData) => rowData["leave"],
            sortable: true,
          },
        ];

  // year = new Date(e.to_date).toLocaleDateString("pt-PT"),
  useEffect(() => {
    if (expireAt < Date.now()) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    axios
      .get(`${host}/year/get_year_leave`)
      .then((response) => {
        let filteredArr = [];
        let responseArr = response.data;
        responseArr.map((e) => {
          filteredArr.push({
            id: e._id,
            year: new Date(e.year).getFullYear(),
            leave: e.leave,
            createdAt: new Date(e.createdAt).toLocaleDateString("pt-PT"),
          });
        });

        setEmpLeaveData(filteredArr);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const deleteYearleave = (data) => {
    //console.log(id);
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
          .fetch(`${host}/year/delete_year_leave/${data.id}`, {
            method: "DELETE",
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

  return (
    <div>
      {/*  <Link to="/Year_leave" className="btn text-dark">
        <TiArrowBack size={30} />
  </Link> */}
      <div>
        <div className="ml-5 mr-5">
          <DataTable
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <h4>Year Leave Details</h4>
                {userData?.role === "HR" && (
                  <Link
                    to="/Year_leave
                "
                    className="btn btn-primary btn-sm ml-5 mr-5"
                  >
                    Add Year Leave (+)
                  </Link>
                )}
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

export default Year_Leave_Details;
