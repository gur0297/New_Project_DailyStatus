import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyUser, resetPassword } from "../actions/authSlice.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./CSS/ForgotPassword.css";

const ForgotPassword = () => {
  const [verifyForm, setVerifyForm] = useState({ username: "", email: "" });
  const [resetForm, setResetForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [id, setId] = useState(null);

  const { isVerifying, isResetting, verifyError, resetError } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    dispatch(verifyUser(verifyForm))
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
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (resetForm.newPassword === resetForm.confirmPassword) {
      dispatch(
        resetPassword({
          id,
          username: verifyForm.username,
          password: resetForm.newPassword,
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
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      setErrorMessage("Passwords do not match");
    }
  };

  return (
    <div className="container">
      <div className="box">
        {!showPasswordForm ? (
          <form onSubmit={handleVerifySubmit}>
            <input
              type="text"
              placeholder="Username"
              value={verifyForm.username}
              onChange={(e) =>
                setVerifyForm({ ...verifyForm, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={verifyForm.email}
              onChange={(e) =>
                setVerifyForm({ ...verifyForm, email: e.target.value })
              }
            />
            <button type="submit">
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={resetForm.newPassword}
              onChange={(e) =>
                setResetForm({ ...resetForm, newPassword: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={resetForm.confirmPassword}
              onChange={(e) =>
                setResetForm({ ...resetForm, confirmPassword: e.target.value })
              }
            />
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
};

export default ForgotPassword;
