import axios from "axios";
import { TiArrowBack } from "react-icons/ti";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import host from "./../utils";
import { CircleSpinner } from "react-spinners-kit";
function TotalPresent() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [empLeaveData, setEmpLeaveData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    var columns = [
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

    ];
    useEffect(() => {

        setLoading(true);
        axios
            .get(`${host}/Emp_Leave/get_leave_today`)
            .then((response) => {
                let filteredArr = [];
                let filteredObj = {};
                let responseArr = response.data.msg;
                console.log(response.data, '........................');
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
                        from_date: new Date(e.from_date).toLocaleDateString("pt-PT"),
                        to_date: new Date(e.to_date).toLocaleDateString("pt-PT"),
                        leave_type: e.leave_type == 1 ? "Full Day" : "Half Day",
                        reason_for_leave: e.reason_for_leave,
                        id: e._id,
                        createdAt: new Date(e.createdAt).toLocaleDateString("pt-PT"),
                    });
                });
                setEmpLeaveData(filteredArr);
                setLoading(false);
            })
            .catch((error) => {
                console.error("There was an error!", error);
                setLoading(false);
            });
    }, []);
    const filteredData = empLeaveData.filter((row) => {
        return (
            row.First_Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div>

            <Link
                to="/employee/manageprofile" className="btn text-dark">
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
                                    <h4>Today Absent</h4>{" "}
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
                        progressPending={loading}
                        progressComponent={<CircleSpinner size={30} color="#686769" loading={loading} />}
                        pagination
                        highlightOnHover
                        search
                    />
                </div>
            </div>
        </div>
    );
}

export default TotalPresent;
