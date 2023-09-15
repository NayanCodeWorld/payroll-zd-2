import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { RotatingLines } from "react-loader-spinner";
import { HiUserGroup } from "react-icons/hi";
import { GiScales } from "react-icons/gi";
import {
  BsEmojiFrownFill,
  BsFillEmojiHeartEyesFill,
  BsFillEmojiLaughingFill,
} from "react-icons/bs";

import host from "./utils";
import "../Css/Dashbord.css";

const Dashboard = () => {
  const [totalEmployee, setTotalEmployee] = useState();
  const [totalHoliday, setTotalHoliday] = useState([]);
  const [todayPresent, setTodayPresent] = useState({});
  const [yesterdayPresent, setYesterdayPresent] = useState({});
  const expireAt = localStorage.getItem("expireAt");
  const userData = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (expireAt < Date.now()) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    window
      .fetch(`${host}/emp/get_employ/${userData.id}`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        //console.log(resp);
        if (resp.message) {
          setTotalEmployee(resp.message);
        } else {
          setTotalEmployee(resp.length);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${host}/Emp_Leave/get_today_leave`)
      .then((resp) => {
        //console.log("today", resp.data);
        setTodayPresent(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${host}/Emp_Leave/get_yesterday_leave`)
      .then((resp) => {
        setYesterdayPresent(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const firstDate = new Date(`${currentYear}-${currentMonth}-01`);
    const lastDate = new Date(currentYear, currentMonth, 0);
    const startDate = firstDate.toISOString().slice(0, 10);
    const endDate = lastDate.toISOString().slice(0, 10);
    const datesobject = { from_date: startDate, end_date: endDate };
    axios
      .post(`${host}/Holiday/get-fastival`, datesobject)
      .then((res) => {
        setTotalHoliday(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchTotalEmployee = async () => {
    if (expireAt < Date.now()) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    const { data } = await axios.get(`${host}/emp/get_employ`);
    //console.log({ ...data });
  };

  return (
    <div id="root">
      <div className="container pt-5">
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
          className="text-center"
        >
          WELCOME TO EMPLOYEE PORTAL
        </h1>
        <div className="row align-items-stretch">
          <Link
            className="c-dashboardInfo col-lg-3 col-md-6 text-black text-decoration-none"
            to={userData.role === "HR" ? "/employee/manageprofile" : "/"}
          >
            <div
              className="wrap"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div>
                <h4 className="">Total Employee</h4>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h1>
                  <HiUserGroup />
                </h1>
                {typeof totalEmployee == "number" ? (
                  <h1>
                    {typeof totalEmployee == "number" ? totalEmployee : null}
                  </h1>
                ) : (
                  <h6>
                    {typeof totalEmployee == "string" ? totalEmployee : null}
                  </h6>
                )}
              </div>
            </div>
          </Link>
          <div className="c-dashboardInfo col-lg-3 col-md-6">
            <Link
              className="c-dashboardInfo col-lg-3 col-md-6 text-black text-decoration-none"
              to="/holiydays"
            >
              <div
                className="wrap"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <h4 className="">Festival Holidays</h4>

                <>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <h1>
                      {totalHoliday.length == 0 ? (
                        <BsEmojiFrownFill />
                      ) : totalHoliday.length < 3 ? (
                        <BsFillEmojiLaughingFill />
                      ) : (
                        <BsFillEmojiHeartEyesFill />
                      )}
                    </h1>
                  </div>
                  <div>
                    {totalHoliday.length > 0 ? (
                      totalHoliday.map((e) => {
                        return (
                          <h6 key={e.holiday_name}>
                            {e.holiday_name} : {e.holiday_date.slice(0, 10)}
                          </h6>
                        );
                      })
                    ) : (
                      <h6>No Holidays This Month</h6>
                    )}
                  </div>
                </>
              </div>
            </Link>
          </div>
          <div className="c-dashboardInfo col-lg-3 col-md-6">
            <Link
              className="c-dashboardInfo col-lg-3 col-md-6 text-black text-decoration-none"
              to="/TotalPresent"
            >
              <div
                className="wrap"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <h4 className="">Today Absent </h4>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h1>
                    <GiScales />
                  </h1>
                </div>

                {typeof totalEmployee == "number" ? (
                  <h2>
                    {todayPresent.absent_count}/{totalEmployee}
                  </h2>
                ) : (
                  <h6>{todayPresent.message}</h6>
                )}
              </div>
            </Link>
          </div>
          <div className="c-dashboardInfo col-lg-3 col-md-6">
            <Link
              className="c-dashboardInfo col-lg-3 col-md-6 text-black text-decoration-none"
              to="/YesterdayApsent"
            >
              <div
                className="wrap"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <h4 className="">Yesterday Absent</h4>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h1>
                    <GiScales />
                  </h1>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "center" }}
                ></div>
                {typeof totalEmployee == "number" ? (
                  <h2>
                    {yesterdayPresent.absent_count}/{totalEmployee}
                  </h2>
                ) : (
                  <h6>{yesterdayPresent.message}</h6>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
