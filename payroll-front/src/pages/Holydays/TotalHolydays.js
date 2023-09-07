import axios from "axios";
import { TiArrowBack, TiInputChecked } from "react-icons/ti";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaTrash } from "react-icons/fa";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { BsPencilSquare } from "react-icons/bs";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import host from "./../utils";
import { ToastContainer, toast } from "react-toastify";

function TotalHolydays() {
  const expireAt = localStorage.getItem("expireAt");
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  let navigate = useNavigate();
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(true);
  const [totalHolydays, setTotalHolydays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [showOnlyWeekends, setShowOnlyWeekends] = useState(false);
  const [showAllHolidays, setShowAllHolidays] = useState(false);
  const [showPublicHoliday, setShowPublicHoliday] = useState(false);
  const [fields, setFields] = useState({});
  const currentYear = new Date().getFullYear();
  const [selectedOption, setSelectedOption] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(0);

  const Year = [2022, 2023, 2024];
  const months = [
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

  function getFirstAndLastDayOfYear(selectedOption) {
    const firstDay = new Date(selectedOption, 0, 1);
    const lastDay = new Date(selectedOption, 11, 31);
    return { firstDay, lastDay };
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleOnchange = (e) => {
    let fieldObj = { ...fields };
    fieldObj[e.target.name] = e.target.value;
    setFields(fieldObj);
  };

  let columns =
    userData.role === "HR"
      ? [
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
            cell: (row) => {
              return row.holiday_type !== "Weekend" ? (
                <Badge bg="success">{row.holiday_type}</Badge>
              ) : (
                <Badge style={{ backgroundColor: "blue" }}>
                  {row.holiday_type}
                </Badge>
              );
            },
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
              <span
                className="btn btn-md"
                onClick={() => {
                  deleteHolyday(row);
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
            cell: (row) => {
              return row.holiday_type !== "Weekend" ? (
                <Badge bg="success">{row.holiday_type}</Badge>
              ) : (
                <Badge style={{ backgroundColor: "blue" }}>
                  {row.holiday_type}
                </Badge>
              );
            },
            sortable: true,
          },

          {
            name: "Created At",
            selector: (rowData) => rowData["createdAt"],
            sortable: true,
          },
        ];

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const { firstDay, lastDay } = getFirstAndLastDayOfYear(selectedOption);

  useEffect(() => {
    if (expireAt < Date.now()) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    const datesobject = {
      from_date: formatDate(firstDay),
      end_date: formatDate(lastDay),
    };
    axios
      .post(`${host}/Holiday/get-holiday`, datesobject)
      .then((res) => {
        const filterArr = [];
        res.data.map((e) => {
          filterArr.push({
            holiday_date: new Date(e.holiday_date).toLocaleDateString("pt-PT"),
            holiday_name: e.holiday_name.toUpperCase(),
            holiday_type: e.holiday_type,
            createdAt: new Date(e.createdAt).toLocaleDateString("pt-PT"),
            id: e._id,
          });
        });
        // console.log(filterArr, '---filterArr----')
        console.log(selectedMonth, "selectedMonth");

        if (selectedMonth) {
          const filteredData = filterArr.filter((entry) => {
            const holidayDate = entry.holiday_date;
            const [day, month, year] = holidayDate.split("/");
            const entryMonth = parseInt(month, 10);

            return entryMonth == selectedMonth;
          });
          //console.log("filteredData", filteredData);
          setTotalHolydays(filteredData);
          // Print the filtered data
          // filteredData.forEach((entry) => {
          //   console.log(entry);
          // });
        }

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
        } else if (!selectedMonth) {
          setTotalHolydays(filterArr);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [showOnlyWeekends, showPublicHoliday, selectedOption, selectedMonth]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    // setSelectedMonth(0)
  };
  const handleMonthFilter = (event) => {
    console.log("event.target.value", event.target.value);
    setSelectedMonth(event.target.value);
  };
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
                  {userData.role === "HR" && (
                    <Button
                      variant="primary"
                      className="ml-5 mr-5 btn-sm"
                      onClick={handleShow}
                    >
                      Add Holiday (+)
                    </Button>
                  )}
                </div>

                <select
                  value={selectedOption}
                  onChange={handleOptionChange}
                  style={{ fontSize: "16px", height: "28px" }}
                >
                  <option value=""></option>

                  {Year &&
                    Year.map((val) => {
                      return (
                        <option value={val} key={val}>
                          {val}
                        </option>
                      );
                    })}
                </select>
                <select
                  defaultValue={selectedMonth}
                  onChange={handleMonthFilter}
                  style={{ fontSize: "16px", height: "28px" }}
                >
                  <option value={selectedMonth} disabled>
                    Filter by month
                  </option>
                  {months &&
                    months.map((val, i) => {
                      return (
                        <option value={i + 1} key={val}>
                          {val}
                        </option>
                      );
                    })}
                </select>

                <div className="d-flex align-items-center ">
                  <ButtonGroup
                    aria-label="Basic example"
                    size="sm"
                    style={{ marginRight: "10px" }}
                  >
                    <ToggleButton
                      variant="outline-secondary"
                      checked={checked3}
                      id="toggle-check"
                      type="checkbox"
                      onClick={(e) => {
                        setShowPublicHoliday(false);
                        setShowOnlyWeekends(false);
                        setShowAllHolidays(!showAllHolidays);
                        setChecked1(false);
                        setChecked2(false);
                        setChecked3(true);
                      }}
                    >
                      All
                    </ToggleButton>
                    <ToggleButton
                      variant="outline-secondary"
                      checked={checked2}
                      id="toggle-check"
                      type="checkbox"
                      onClick={(e) => {
                        setShowPublicHoliday(!showPublicHoliday);
                        setShowAllHolidays(false);
                        setShowOnlyWeekends(false);
                        setChecked1(false);
                        setChecked2(true);
                        setChecked3(false);
                      }}
                    >
                      Public
                    </ToggleButton>
                    <ToggleButton
                      variant="outline-secondary"
                      checked={checked1}
                      id="toggle-check"
                      type="checkbox"
                      onClick={(e) => {
                        setShowOnlyWeekends(!showOnlyWeekends);
                        setShowAllHolidays(false);
                        setShowPublicHoliday(false);
                        setChecked1(true);
                        setChecked2(false);
                        setChecked3(false);
                      }}
                    >
                      Weekend
                    </ToggleButton>
                  </ButtonGroup>
                  {/*  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitches"
                    onChange={(e) => {
                      setShowPublicHoliday(false);
                      setShowOnlyWeekends(false);
                      setShowAllHolidays(!showAllHolidays);
                    }}
                     checked={showAllHolidays}
                  />
                  <span
                    className="px-2 d-flex"
                    style={{ fontSize: "10px" }}
                    htmlFor="customSwitches"
                  >
                    All Holidays
                  </span>
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitches"
                    onChange={(e) => {
                      setShowPublicHoliday(!showPublicHoliday);
                      setShowAllHolidays(false);
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
                      setShowAllHolidays(false);
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
                  </span>*/}
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
