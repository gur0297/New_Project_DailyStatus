import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../actions/authSlice.js";
import './CSS/NewPasswordForm.css';
import gifBackground from "./gifs/password.gif";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const NewPasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/\d/, "Password must contain a number")
      .matches(/[a-z]/, "Password must contain a lowercase letter")
      .matches(
        /[!@#$%^&*()\-_"=+[\]{}`~;:'|<>,.?/]/,
        "Password must contain a special symbol"
      )
      .matches(/[A-Z]/, "Password must contain an uppercase letter"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const [conditions, setConditions] = useState({
    length: false,
    number: false,
    lowerCase: false,
    upperCase: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    setConditions({
      length: password.length >= 8,
      number: /\d/.test(password),
      lowerCase: /[a-z]/.test(password),
      upperCase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*()\-_"=+[\]{}`~;:'|<>,.?/]/.test(password),
    });
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(updatePassword({ password: values.password }))
        .then(() => {
          Swal.fire("Success", "Password updated successfully!", "success");
          navigate("/home"); // Navigate to the home page
        })
        .catch(() => {
          Swal.fire(
            "Error",
            "An error occurred while updating the password.",
            "error"
          );
        });
    },
  });

  useEffect(() => {
    validatePassword(formik.values.password);
  }, [formik.values.password]);

  return (
    <div
      className="parent-container"
      style={{ backgroundImage: `url(${gifBackground})` }}
    >
      <div className="empty-half" />
      <div className="form-container">
        <form onSubmit={formik.handleSubmit} className="password-form">
          <div className="input-row text-warning">
            <label htmlFor="password">Your new Password:</label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div style={{ color: "darkred", fontWeight: "bold" }}>
                {formik.errors.password}
              </div>
            ) : null}

            <ul className="password-conditions">
              <li style={{ color: conditions.length ? "white" : "red" }}>
                At least 8 characters
              </li>
              <li style={{ color: conditions.number ? "white" : "red" }}>
                At least 1 number
              </li>
              <li style={{ color: conditions.lowerCase ? "white" : "red" }}>
                At least 1 lowercase letter
              </li>
              <li style={{ color: conditions.upperCase ? "white" : "red" }}>
                At least 1 uppercase letter
              </li>
              <li style={{ color: conditions.specialChar ? "white" : "red" }}>
                At least 1 special character
              </li>
            </ul>
          </div>

          <div className="input-row text-white">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              {...formik.getFieldProps("confirmPassword")}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div style={{ color: "darkred", fontWeight: "bold" }}>
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Update Your Password</button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordForm;
