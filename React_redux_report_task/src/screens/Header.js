import React from "react";
import { Link, useNavigate } from "react-router-dom";
import e from "../e.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faPhone,
  faRightFromBracket,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/authSlice.js";
import Swal from "sweetalert2";

const Header = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());

    Swal.fire({
      title: "Logout Successful",
      text: "You have successfully logged out.",
      icon: "success",
    }).then(() => {
      navigate("/"); // Navigate to home page after logout
    });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <Link to="/" className="navbar-brand text-white">
          <img
            src={e}
            alt="Logo"
            width="138"
            height="53"
            className="d-inline-block align-text-top"
          />
          <span
            style={{ fontWeight: "bold", fontSize: "larger", color: "#ffffff" }}
          >
            3G
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {token ? (
            <button
              className="nav-link text-warning"
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "inline-flex", // Add this line to make the button inline
                alignItems: "center", // Add this line to align the button content vertically
                padding: "0", // Add this line to remove any padding
              }}
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="mr-2 fa-lg"
              />
              <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                Logout
              </span>
            </button>
          ) : (
            <Link to="/log" className="nav-link text-white-bold">
              <FontAwesomeIcon icon={faGlobe} className="mr-1" />
              <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                Login
              </span>
            </Link>
          )}

          <ul className="navbar-nav ml-auto">
            <div className="navbar-nav ml-auto">
              <Link to="/about" className="nav-link text-success">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 fa-lg" />
                <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                  About
                </span>
              </Link>

              <Link to="/contact" className="nav-link text-danger">
                <FontAwesomeIcon icon={faPhone} className="mr-2 fa-lg" />
                <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                  Contact
                </span>
              </Link>
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
