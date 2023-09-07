import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you really want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        navigate("/");
        window.location.reload();
      } else {
        navigate("/");
      }
    });
  }
  useEffect(() => {
    handleLogout();
  }, []);
  return (
    // <div style={{ float: "right" }}>
    //   <Button onClick={handleLogout}>Log out</Button>
    // </div>
    <></>
  );
}
