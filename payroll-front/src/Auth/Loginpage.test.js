// import React from "react";
// import { render, screen, waitFor } from "@testing-library/react";
// import user from "@testing-library/user-event";
// import { createServer } from "../mocks/server";

// import LoginPage from "./LoginPage";
// import { JellyfishSpinner } from "react-spinners-kit";

// describe("LoginPage Component", () => {
//   test("renders the login form correctly", () => {
//     const mockFunction = jest.fn();
//     render(<LoginPage onLogin={mockFunction} />);

//     const emailInputEl = screen.getByLabelText("Email address");
//     const passwordInputEl = screen.getByLabelText("Password");
//     const submitButtonEl = screen.getByText("Submit");

//     expect(emailInputEl).toBeInTheDocument();
//     expect(passwordInputEl).toBeInTheDocument();
//     expect(submitButtonEl).toBeInTheDocument();
//   });

//   test("Given error message when submitting without providing email and password", async () => {
//     const mockFunction = jest.fn();
//     const { getByLabelText, getByText } = render(
//       <LoginPage onLogin={mockFunction} />
//     );

//     const emailInput = getByLabelText("Email address");
//     const passwordInput = getByLabelText("Password");
//     const submitButton = getByText("Submit");

//     user.type(emailInput, "test@gmail.com");
//     user.type(passwordInput, "test12345");
//     user.click(submitButton);

//     expect(emailInput.value).not.toHaveLength(0);
//     expect(passwordInput.value).not.toHaveLength(0);
//   });

//   test("submits the form with valid input", async () => {
//     createServer([
//       {
//         path: "/auth/login",
//         method: "post",
//         res: (req, res, ctx) => {
//           return {
//             token: "mockToken",
//             userData: { username: "testuser" },
//           };
//         },
//       },
//     ]);
//     const mockHandleLogin = jest.fn();
//     const mockFunction = jest.fn();
//     const { getByLabelText, getByText } = render(
//       <LoginPage onLogin={mockFunction} handleLogin={mockHandleLogin} />
//     );

//     const emailInput = getByLabelText("Email address");
//     const passwordInput = getByLabelText("Password");
//     const submitButton = getByText("Submit");

//     user.type(emailInput, "test@gmail.com");
//     user.type(passwordInput, "test12345");
//     user.click(submitButton);

//     screen.debug();
//   });
// });

// import React from "react";
// import { render, fireEvent, waitFor } from "@testing-library/react";
// import LoginPage from "./LoginPage";
// import axios from "axios"; // Import axios for mocking
// jest.mock("axios"); // Mock axios

// // Helper function to set up a successful login response
// const mockSuccessfulLogin = () => {
//   axios.post.mockResolvedValueOnce({
//     data: {
//       token: "mockToken",
//       userData: { username: "mockUser" },
//       expireAt: "mockExpireAt",
//     },
//   });
// };

// // Helper function to set up a failed login response
// const mockFailedLogin = () => {
//   axios.post.mockRejectedValueOnce({ message: "Invalid credentials" });
// };

// test("handles successful login", async () => {
//   mockSuccessfulLogin();
//   const onLoginMock = jest.fn(); // Mock the onLogin function

//   const { getByLabelText, getByText } = render(
//     <LoginPage onLogin={onLoginMock} />
//   );

//   fireEvent.change(getByLabelText("Email address"), {
//     target: { value: "test@example.com" },
//   });
//   fireEvent.change(getByLabelText("Password"), {
//     target: { value: "password123" },
//   });

//   fireEvent.click(getByText("Submit"));

//   // Wait for the login process to complete
//   await waitFor(() => {
//     expect(localStorage.getItem("token")).toBe("mockToken");
//     expect(localStorage.getItem("userInfo")).toBe('{"username":"mockUser"}');
//     expect(localStorage.getItem("expireAt")).toBe("mockExpireAt");
//     expect(onLoginMock).toHaveBeenCalled(); // Ensure onLogin was called
//   });
// });

// test("handles failed login", async () => {
//   mockFailedLogin();

//   const { getByLabelText, getByText } = render(<LoginPage />);

//   fireEvent.change(getByLabelText("Email address"), {
//     target: { value: "test@example.com" },
//   });
//   fireEvent.change(getByLabelText("Password"), {
//     target: { value: "wrongPassword" },
//   });

//   fireEvent.click(getByText("Submit"));

//   // Wait for the login process to complete
//   await waitFor(() => {
//     expect(localStorage.getItem("token")).toBeNull();
//     expect(localStorage.getItem("userInfo")).toBeNull();
//     expect(localStorage.getItem("expireAt")).toBeNull();
//     expect(getByText("Invalid email or password.")).toBeInTheDocument();
//   });
// });
