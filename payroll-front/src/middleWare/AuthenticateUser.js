import React from "react";
import { useNavigate } from "react-router-dom";

const AuthenticateUser = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo?.role !== "HR") {
    return true;
  }
  return false;
};

export default AuthenticateUser;
