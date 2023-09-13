import React, { useContext, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./loginpage.css";
import axios from "axios";
import host from "../pages/utils";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  //  function is running to the cod
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${host}/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response.data.userData)
        );
        localStorage.setItem("expireAt", response.data.expireAt);
        onLogin();
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.log("Error", error);
      setShowError(true);
    }
  };

  return (
    <div className="Login">
      <Form onSubmit={handleLogin}>
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
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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

export default LoginPage;
