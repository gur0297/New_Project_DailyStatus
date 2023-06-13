import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyUser, resetPassword } from "../actions/authSlice.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./CSS/ForgotPassword.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import backgroundImage from "./gifs/g.gif"; //import your gif file here
import "./CSS/ForgotPassword.css";

// Create validation schemas
const verifySchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email().required("Email is required"),
});

const resetSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/\d/, "Password must contain a number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain a special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

const ForgotPassword = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [id, setId] = useState(null);

  const { isVerifying, isResetting, verifyError, resetError } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Formik for verify form
  const verifyFormik = useFormik({
    initialValues: { username: "", email: "" },
    validationSchema: verifySchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      dispatch(verifyUser(values))
        .unwrap()
        .then((user) => {
          setShowPasswordForm(true);
          setId(user.id);
          Swal.fire({
            title: "Success",
            text: "User is successfully verified",
            icon: "success",
            confirmButtonText: "OK",
          });
          setSubmitting(false);
        })
        .catch((error) => {
          setErrorMessage(error.message);
          setSubmitting(false);
        });
    },
  });

  // Formik for reset form
  const resetFormik = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema: resetSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      dispatch(
        resetPassword({
          id,
          username: verifyFormik.values.username,
          password: values.newPassword,
        })
      )
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Success",
            text: "Your password is reset successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/");
          });
          setSubmitting(false);
        })
        .catch((error) => {
          setErrorMessage(error.message);
          setSubmitting(false);
        });
    },
  });

  // ...
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
    >
      <div className="box">
        {!showPasswordForm ? (
          <form onSubmit={verifyFormik.handleSubmit}>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={verifyFormik.values.username}
              onChange={verifyFormik.handleChange}
              onBlur={verifyFormik.handleBlur}
            />
            {verifyFormik.touched.username && verifyFormik.errors.username ? (
              <div style={{ color: "white", fontWeight: "bold" }}>
                {verifyFormik.errors.username}
              </div>
            ) : null}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={verifyFormik.values.email}
              onChange={verifyFormik.handleChange}
              onBlur={verifyFormik.handleBlur}
            />
            {verifyFormik.touched.email && verifyFormik.errors.email ? (
              <div style={{ color: "white", fontWeight: "bold" }}>
                {verifyFormik.errors.email}
              </div>
            ) : null}
            <button type="submit">
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetFormik.handleSubmit}>
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={resetFormik.values.newPassword}
              onChange={resetFormik.handleChange}
              onBlur={resetFormik.handleBlur}
            />
            <ul className="password-conditions">
              <li
                style={{
                  color:
                    resetFormik.values.newPassword.length >= 8
                      ? "white"
                      : "yellow",
                }}
              >
                Password must be at least 8 characters
              </li>
              <li
                style={{
                  color: /[a-z]/.test(resetFormik.values.newPassword)
                    ? "white"
                    : "yellow",
                }}
              >
                Password must contain a lowercase letter
              </li>
              <li
                style={{
                  color: /[A-Z]/.test(resetFormik.values.newPassword)
                    ? "white"
                    : "yellow",
                }}
              >
                Password must contain an uppercase letter
              </li>
              <li
                style={{
                  color: /\d/.test(resetFormik.values.newPassword)
                    ? "white"
                    : "yellow",
                }}
              >
                Password must contain a number
              </li>
              <li
                style={{
                  color: /[!@#$%^&*(),.?":{}|<>]/.test(
                    resetFormik.values.newPassword
                  )
                    ? "white"
                    : "yellow",
                }}
              >
                Password must contain a special character
              </li>
            </ul>
            {resetFormik.touched.newPassword &&
            resetFormik.errors.newPassword ? (
              <div style={{ color: "white", fontWeight: "bold" }}>
                {resetFormik.errors.newPassword}
              </div>
            ) : null}
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={resetFormik.values.confirmPassword}
              onChange={resetFormik.handleChange}
              onBlur={resetFormik.handleBlur}
            />
            {resetFormik.touched.confirmPassword &&
            resetFormik.errors.confirmPassword ? (
              <div style={{ color: "white", fontWeight: "bold" }}>
                {resetFormik.errors.confirmPassword}
              </div>
            ) : null}
            <button type="submit">
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        {errorMessage && <p>{errorMessage}</p>}
        {(verifyError || resetError) && <p>{verifyError || resetError}</p>}
      </div>
    </div>
  );
  // ...
};

export default ForgotPassword;
