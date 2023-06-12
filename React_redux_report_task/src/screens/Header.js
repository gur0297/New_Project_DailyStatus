import React from "react";
import { Link, useNavigate } from "react-router-dom";
import e from "./images/e.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faPhone,
  faRightFromBracket,
  faGlobe,
  faStreetView,
  faPaperclip,
  faIdCardClip,
  faGears,
  faChartLine,
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
          <ul className="navbar-nav mr-auto align-items-center">
            {token ? (
              <li className="nav-item">
                <Link
                  className="nav-link text-danger btn btn-link"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="mr-2 fa-lg"
                  />
                  <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                    Logout
                  </span>
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/log" className="nav-link text-primary">
                  <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                  <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                    Login
                  </span>
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link to="/sadTb" className="nav-link text-warning">
                <FontAwesomeIcon
                  icon={faGears}
                  beatFade
                  className="mr-2 fa-lg"
                />
                <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                  Super Admin Table
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/mTb" className="nav-link text-warning">
                <FontAwesomeIcon
                  icon={faStreetView}
                  beatFade
                  className="mr-2 fa-lg"
                />
                <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                  Manager's Table
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/myStatus" className="nav-link text-warning">
                <FontAwesomeIcon icon={faPaperclip} className="mr-2 fa-lg" />
                <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                  My Status
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/myStatus" className="nav-link text-warning">
                <FontAwesomeIcon
                  icon={faChartLine}
                  beat
                  className="mr-2 fa-lg"
                />
                <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                  Dashboard
                </span>
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/profile" className="nav-link text-warning">
                <FontAwesomeIcon
                  icon={faIdCardClip}
                  beatFade
                  className="mr-2 fa-lg"
                />
                <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                  My Profile
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/about" className="nav-link text-success">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 fa-lg" />
                <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                  About
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/contact" className="nav-link text-danger">
                <FontAwesomeIcon icon={faPhone} className="mr-2 fa-lg" />
                <span style={{ fontWeight: "bold", fontSize: "larger" }}>
                  Contact
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;

