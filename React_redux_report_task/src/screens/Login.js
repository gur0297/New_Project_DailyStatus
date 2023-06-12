import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  loginStart,
  loginFailure,
  registerStart,
  registerFailure,
  login,
  register,
  fetchDepartments,
  fetchRoles,
} from "../actions/authSlice.js";
import Swal from "sweetalert2";
import "./CSS/Login.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggingIn, isRegistering, error } = useSelector(
    (state) => state.auth
  );
  const roles = useSelector((state) => state.auth.roles);
  const departments = useSelector((state) => state.auth.departments);

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("UserName field is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .matches(/[1-9]/, {
        message: "Password must contain a number (1...9).",
        excludeEmptyString: true,
      })
      .matches(/[a-z]/, {
        message: "Password must contain a lowercase letter (a...z).",
        excludeEmptyString: true,
      })
      .matches(/[!@$%^&*]/, {
        message: "Password must contain a special symbol (!...$).",
        excludeEmptyString: true,
      })
      .matches(/[A-Z]/, {
        message: "Password must contain an uppercase letter (A...Z).",
        excludeEmptyString: true,
      })
      .required("Password field is required."),
  });

  const PasswordRequirements = ({ password }) => {
    return (
      <ol>
        <li style={{ color: password.length >= 8 ? "green" : "red" }}>
          Password must be at least 8 characters
        </li>
        <li style={{ color: /[1-9]/.test(password) ? "green" : "red" }}>
          Password must contain a number (1...9)
        </li>
        <li style={{ color: /[a-z]/.test(password) ? "green" : "red" }}>
          Password must contain a lowercase letter (a...z)
        </li>
        <li style={{ color: /[!@$%^&*]/.test(password) ? "green" : "red" }}>
          Password must contain a special symbol (!...$)
        </li>
        <li style={{ color: /[A-Z]/.test(password) ? "green" : "red" }}>
          Password must contain an uppercase letter (A...Z)
        </li>
      </ol>
    );
  };

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Name field is required"),
    address: Yup.string()
      .min(2, "Too Short!")
      .max(100, "Too Long!")
      .required("Address field is required"),
    department_Id: Yup.string().required("Please select your department"),
    role_Id: Yup.string().required("Please select your role"),
    username: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("UserName field is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email field is required"),
  });

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchRoles());
  }, []);

  return (
    <div className="login-wrapper login-page">
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
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              validationSchema={LoginSchema}
              onSubmit={async (values) => {
                dispatch(loginStart());
                try {
                  const loginResponse = await dispatch(login(values));
                  const { passwordChangeStatus, id } = loginResponse.payload;
                  if (passwordChangeStatus) {
                    Swal.fire({
                      icon: "success",
                      title: "Login Successful",
                      text: "You have successfully logged in.",
                    });
                    navigate("/home");
                  } else {
                    Swal.fire({
                      icon: "success",
                      title: "Login Successful",
                      text: "You have successfully logged in.",
                      showCancelButton: true,
                      confirmButtonText: "Generate Your New Password",
                      cancelButtonText: "Not Change My Random Password",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate(`/npform/${id}`);
                      } else if (result.dismiss === Swal.DismissReason.cancel) {
                        navigate("/home");
                      }
                    });
                  }
                } catch (error) {
                  dispatch(loginFailure());
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
                  navigate("/home");
                }
              }}
            >
              {({ isSubmitting, values }) => (
                <Form className="form form-login">
                  <fieldset>
                    <legend>
                      Please, enter your email and password for login.
                    </legend>
                    <div className="input-block">
                      <label htmlFor="login-email">UserName</label>
                      <Field
                        id="login-username"
                        type="text"
                        name="username"
                        placeholder="Write Your UserName"
                      />
                      <ErrorMessage name="username" component="div" />
                    </div>
                    <div className="input-block">
                      <label htmlFor="login-password">Password</label>
                      <Field
                        id="login-password"
                        type="password"
                        name="password"
                        placeholder="Write Your Password"
                      />
                      <PasswordRequirements password={values.password} />
                      <ErrorMessage name="password" component="div" />
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    className="btn-login"
                    disabled={isLoggingIn || isSubmitting}
                  >
                    {isLoggingIn ? "Loading..." : "Login"}
                  </button>
                  <div className="forgot-password-link">
                    <Link to="/forgotpwd">Forgot Your Password?</Link>
                  </div>
                  {error && <p className="login-error">{error}</p>}
                </Form>
              )}
            </Formik>
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
            <Formik
              initialValues={{
                name: "",
                address: "",
                department_Id: "",
                role_Id: "",
                username: "",
                email: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (values) => {
                dispatch(registerStart());
                try {
                  await dispatch(register(values));
                  Swal.fire({
                    icon: "success",
                    title: "Registration Successful",
                    text: "You have successfully registered.",
                  });
                  navigate("/home");
                } catch (error) {
                  dispatch(registerFailure());
                  console.error(error);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to register.",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                  });
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="form form-signup">
                  <fieldset>
                    <legend>Please, enter your details for sign up.</legend>
                    <div className="input-block">
                      <label htmlFor="signup-name">Name</label>
                      <Field
                        id="signup-name"
                        type="text"
                        name="name"
                        placeholder="Write Your Name"
                      />
                      <ErrorMessage name="name" component="div" />
                    </div>
                    <div className="input-block">
                      <label htmlFor="signup-address">Address</label>
                      <Field
                        id="signup-address"
                        type="text"
                        name="address"
                        placeholder="Write Your Address"
                      />
                      <ErrorMessage name="address" component="div" />
                    </div>
                    <div className="input-block">
                      <label htmlFor="signup-department">Department</label>
                      <Field as="select" name="department_Id">
                        <option value="" disabled hidden>
                          Select Your Department
                        </option>
                        {departments.map((department) => (
                          <option value={department.id} key={department.id}>
                            {department.department_Name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="department_Id" component="div" />
                    </div>
                    <div className="input-block">
                      <label htmlFor="signup-role">Role</label>
                      <Field as="select" name="role_Id">
                        <option value="" disabled hidden>
                          Select Your Role
                        </option>
                        {roles.map((role) => (
                          <option value={role.id} key={role.id}>
                            {role.role_Name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="role_Id" component="div" />
                    </div>

                    <div className="input-block">
                      <label htmlFor="signup-username">UserName</label>
                      <Field
                        id="signup-username"
                        type="text"
                        name="username"
                        placeholder="Write Your UserName"
                      />
                      <ErrorMessage name="username" component="div" />
                    </div>

                    <div className="input-block">
                      <label htmlFor="signup-email">E-mail</label>
                      <Field
                        id="signup-email"
                        type="email"
                        name="email"
                        placeholder="Write Your E-mail"
                      />
                      <ErrorMessage name="email" component="div" />
                    </div>
                  </fieldset>
                  <button
                    type="submit"
                    className="btn-login"
                    disabled={isRegistering || isSubmitting}
                  >
                    {isRegistering ? "Loading..." : "Sign Up"}
                  </button>
                  {error && <p className="login-error">{error}</p>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
