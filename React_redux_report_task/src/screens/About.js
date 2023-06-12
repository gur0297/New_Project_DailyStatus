import React from "react";
import "./CSS/About.css";
import g from "./images/g.JPG";

function About() {
  return (
    <div className="container">
      <div className="about-page bg-danger">
        <h1>About Us</h1>
        <p>
          Welcome to our 3G Develope's Hub.
          Our website is dedicated to providing you with daily status reports,
          and we have a dedicated developer team that collaborates with us to
          ensure accurate and up-to-date information. We work closely with our
          developers to gather real-time data, analyze trends, and deliver the
          most relevant insights to our users.
        </p>
        <h2>Our Team</h2>
        <div className="container ">
          <div className="col-12 text-center">
            <div className="team-member">
              <img src={g} alt="Person 1" />
              <h3>Gurpreet Singh</h3>
              <p>Founder and CEO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
