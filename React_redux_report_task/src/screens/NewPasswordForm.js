import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../actions/authSlice.js"; // Import your action here
import "./NewPasswordForm.css";
import gifBackground from "../password.gif";

const NewPasswordForm = () => {
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    setPasswordMatchError(false);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordMatchError(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    // Dispatch your updatePassword action here
    dispatch(updatePassword({ password }));

    // Reset the form after submission

    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div
      className="parent-container"
      style={{ backgroundImage: `url(${gifBackground})` }}
    >
      <div className="empty-half" />
      <div className="form-container">
        <form onSubmit={handleFormSubmit} className="password-form">
          <div className="input-row text-warning">
            <label htmlFor="newPassword">Your new Password:</label>
            <input
              type="password"
              id="newPassword"
              value={password}
              onChange={handleNewPasswordChange}
              required
            />
          </div>

          <div className="input-row text-white">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>

          {passwordMatchError && (
            <p className="error-message">Passwords do not match.</p>
          )}
          {isLoading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Update Your Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordForm;
