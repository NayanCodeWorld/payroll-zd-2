import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./loginpage.css";
import axios from "axios";
import host from "../utils";

function ChangePassword({ onLogin }) {
    const [email, setEmail] = useState("");
    const [oldpassword, setOldpassword] = useState("");
    const [newPassword, setNewpassword] = useState("")
    const [showError, setShowError] = useState(false);
    //   http://localhost:7074/login/change-password
    const handleLogin = (event) => {
        // handle login logic here
        event.preventDefault();
        console.log({ email, oldpassword, newPassword });
        axios
            .post(`${host}/login/change-password`, { email, oldpassword, newPassword })
            .then((res) => {
                console.log("response", res.data, '11111111');
                if (res.data.token) {
                    // redirect to home page or do something else
                    localStorage.setItem('token', res.data.token);
                    onLogin();
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
                    <Form.Label> Old Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={oldpassword}
                        onChange={(event) => setOldpassword(event.target.value)}
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
