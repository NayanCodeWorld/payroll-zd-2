import axios from "axios";
import { TiArrowBack } from "react-icons/ti";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaTrash } from "react-icons/fa";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { BsPencilSquare } from "react-icons/bs";

import host from "./../utils";
import { ToastContainer, toast } from "react-toastify";

function TotalHolydays() {
  let navigate = useNavigate();

  const [totalHolydays, setTotalHolydays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [showOnlyWeekends, setShowOnlyWeekends] = useState(false);
  const [showPublicHoliday, setShowPublicHoliday] = useState(false);
  const [fields, setFields] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleOnchange = (e) => {
    let fieldObj = { ...fields };
    fieldObj[e.target.name] = e.target.value;
    setFields(fieldObj);
  };
  var columns = [
    {
      name: "Holyday Name",
      selector: (rowData) => rowData["holiday_name"],
      sortable: true,
      width: 30,
    },
    {
      name: "Holiday Date",
      selector: (rowData) => rowData["holiday_date"],
      sortable: true,
    },
    {
      name: "Holyday Type",
      selector: (rowData) => rowData["holiday_type"],
      cell: (row) => (
        <>
          {row.holiday_type !== "Weekend" ? (
            <Badge bg="success">{row.holiday_type}</Badge>
          ) : (
            row.holiday_type
          )}
        </>
      ),
      sortable: true,
    },

    {
      name: "Created At",
      selector: (rowData) => rowData["createdAt"],
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <span
            className="btn btn-md"
            onClick={() => {
              deleteHolyday(row);
            }}
          >
            <FaTrash />
          </span>
        </>
      ),

      ignoreRowClick: true,
    },
  ];
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const lastDay = new Date(today.getFullYear(), 11, 31);
    const datesobject = {
      from_date: formatDate(firstDay),
      end_date: formatDate(lastDay),
    };
    axios
      .post(`${host}/Holiday/get-holiday`, datesobject)
      .then((res) => {
        console.log(res.data, "......");
        const filterArr = [];
        res.data.map((e) => {
          filterArr.push({
            holiday_date: new Date(e.holiday_date).toLocaleDateString("pt-PT"),
            holiday_name: e.holiday_name,
            holiday_type: e.holiday_type,
            createdAt: new Date(e.createdAt).toLocaleDateString("pt-PT"),
            id: e._id,
          });
        });
        if (showOnlyWeekends || showPublicHoliday) {
          let weekendsArr = [];
          let publicHolidayArr = [];
          filterArr.map((ele) => {
            if (ele.holiday_type === "Weekend") {
              weekendsArr.push(ele);
            } else {
              publicHolidayArr.push(ele);
            }
          });
          if (showOnlyWeekends) {
            console.log("showOnlyWeekends", weekendsArr);
            setTotalHolydays(weekendsArr);
          }
          if (showPublicHoliday) {
            setTotalHolydays(publicHolidayArr);
          }
        } else {
          setTotalHolydays(filterArr);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [showOnlyWeekends, showPublicHoliday]);
  const LoadEdit = (_id) => {
    navigate("/employee/EmpEdit" + _id);
  };
  const deleteHolyday = (id) => {
    console.log(id, "****");
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
          .fetch(`${host}/Holiday/holiday_dalate/` + id.id, {
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
  const notify = (message) => {
    toast(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const handleHoliydaySubmit = (e) => {
    e.preventDefault();
    console.log("fields", fields);
    axios
      .post(`${host}/Holiday/holiday`, fields)
      .then((response) => {
        console.log("success", response);
        if (response.data.message == "Success ") {
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: "Successfully!",
          }).then(() => {
            handleClose();
            navigate("/holiydays");
          });
        } else {
          notify(response.data.message);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const filteredData = totalHolydays.filter((row) => {
    return (
      row.holiday_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.holiday_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.holiday_date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <div>
        <ToastContainer />
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
                  <h4>Holidays</h4>{" "}
                  <Button
                    variant="primary"
                    className="ml-5 mr-5 btn-sm"
                    onClick={handleShow}
                  >
                    Add Holiday (+)
                  </Button>
                </div>
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitches"
                    onChange={(e) => {
                      setShowPublicHoliday(!showPublicHoliday);
                      setShowOnlyWeekends(false);
                    }}
                    checked={showPublicHoliday}
                  />
                  <span
                    className="px-2 d-flex"
                    style={{ fontSize: "10px" }}
                    htmlFor="customSwitches"
                  >
                    Public Holidays
                  </span>
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitches"
                    onChange={(e) => {
                      setShowOnlyWeekends(!showOnlyWeekends);
                      setShowPublicHoliday(false);
                    }}
                    checked={showOnlyWeekends}
                  />
                  <span
                    className="px-2 d-flex"
                    style={{ fontSize: "10px" }}
                    htmlFor="customSwitches"
                  >
                    Show Weekends
                  </span>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Holiyday Name</Form.Label>
              <Form.Control
                type="text"
                name="holiday_name"
                placeholder="Enter Holiday Name"
                onChange={(e) => handleOnchange(e)}
              />
            </Form.Group>

            <Form.Group controlId="formHolidayType">
              <Form.Label>Holiday Type</Form.Label>
              <select
                name="holiday_type"
                className="form-control"
                onChange={(e) => handleOnchange(e)}
              >
                <option disabled={true} selected={true}>
                  Select Holiday Type
                </option>
                <option>Public</option>
                <option>Weekend</option>
              </select>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Holiyday Date</Form.Label>
              <Form.Control
                type="date"
                name="holiday_date"
                placeholder="Select Holiday Date"
                onChange={(e) => handleOnchange(e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => handleHoliydaySubmit(e)}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TotalHolydays;
