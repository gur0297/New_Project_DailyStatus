import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../actions/authSlice.js";
import Swal from "sweetalert2";
//import 'sweetalert2/src/sweetalert2.scss';
import "./Login.css"; // Import CSS file for styling
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isLogin) {
  //     dispatch(login({ email, password }))
  //       .then(() => {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Login Successful",
  //           text: "You have successfully logged in.",
  //           showCancelButton: true, // Display the buttons
  //           confirmButtonText: "Generate Your New Password",
  //           cancelButtonText: "Not Change My Random Password",
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             navigate("/npform"); // Navigate to the new password page
  //           } else if (result.dismiss === Swal.DismissReason.cancel) {
  //             navigate("/home"); // Navigate to the home page
  //           }
  //         });
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Error",
  //           text: "Invalid username or password.",
  //           toast: true,
  //           position: "top-end",
  //           showConfirmButton: false,
  //           timer: 3000,
  //         });
  //       });
  //   } else {
  //     if (password === confirmPassword) {
  //       dispatch(register({ email, password }))
  //         .then(() => {
  //           Swal.fire({
  //             icon: "success",
  //             title: "Registration Successful",
  //             text: "You have successfully registered.",
  //           });
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //           Swal.fire({
  //             icon: "error",
  //             title: "Error",
  //             text: "Invalid username or password.",
  //             toast: true,
  //             position: "top-end",
  //             showConfirmButton: false,
  //             timer: 3000,
  //           });
  //         });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Password and confirm password do not match.",
  //         toast: true,
  //         position: "top-end",
  //         showConfirmButton: false,
  //         timer: 3000,
  //       });
  //     }
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ email, password }))
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "You have successfully logged in.",
            showCancelButton: true, // Display the buttons
            confirmButtonText: "Generate Your New Password",
            cancelButtonText: "Not Change My Random Password",
          }).then((result) => {
            if (result.isConfirmed) {
              const id = localStorage.getItem("id"); // Get the id from local storage
              navigate(`/npform/${id}`); // Navigate to the new password page with id in the URL
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              navigate("/home"); // Navigate to the home page
            }
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid username or password.",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
        });
    } else {
      if (password === confirmPassword) {
        dispatch(register({ email, password }))
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Registration Successful",
              text: "You have successfully registered.",
            });
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Invalid username or password.",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
            });
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Password and confirm password do not match.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };
  

  return (
    <section className="forms-section">
      <h1 className="section-title">Welcome to our 3G Dev Hub</h1>
      <div className="forms">
        <div className={`form-wrapper ${isLogin ? "is-active" : ""}`}>
          <button
            type="button"
            className="switcher switcher-login"
            onClick={() => setIsLogin(true)}
          >
            Login
            <span className="underline"></span>
          </button>
          <form className="form form-login" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Please, enter your email and password for login.</legend>
              <div className="input-block">
                <label htmlFor="login-email">E-mail</label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </fieldset>
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>
            {error && <p className="login-error">{error}</p>}
          </form>
        </div>
        <div className={`form-wrapper ${!isLogin ? "is-active" : ""}`}>
          <button
            type="button"
            className="switcher switcher-signup"
            onClick={() => setIsLogin(false)}
          >
            Sign Up
            <span className="underline"></span>
          </button>
          <form className="form form-signup" onSubmit={handleSubmit}>
            <fieldset>
              <legend>
                Please, enter your email, password and password confirmation for
                sign up.
              </legend>
              <div className="input-block">
                <label htmlFor="signup-email">E-mail</label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label htmlFor="signup-password-confirm">
                  Confirm password
                </label>
                <input
                  id="signup-password-confirm"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </fieldset>
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
            {error && <p className="login-error">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
