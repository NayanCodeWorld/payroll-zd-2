import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./loginpage.css";
import axios from "axios";
import host from "../utils";

function ChangePassword({ onLogin }) {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewpassword] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    event.preventDefault();
    console.log({ email, oldPassword, newPassword });
    axios
      .post(`${host}/auth/change-password`, {
        email,
        oldPassword,
        newPassword,
      })
      .then((res) => {
        if (res.status === 200) {
          alert(res.msg);
          navigate("/");
        } else {
          setShowError(true);
        }
      })
      .catch((err) => {
        console.log("Error", err);
        setShowError(true);
      });
  };

  return (
    <div className="Login">
      <Form onSubmit={handlePasswordChange}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label> Old Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label> New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(event) => setNewpassword(event.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        {showError && (
          <Alert variant="danger" className="mt-3">
            Invalid email or password.
          </Alert>
        )}
      </Form>
    </div>
  );
}

export default ChangePassword;
