import React, { Component } from "react";
import StudentNavbar from "./StudentNavbar"; // Import the StudentNavbar component
import StudentCards from "./StudentCards";
import { Link } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img4 from "../assets/img4.jpg";

const football_desc =
  "Don Bosco College of Engineering's football ground is meticulously maintained, offering a pristine pitch with marked boundaries and goalposts. Regular upkeep ensures safety and enjoyment for athletes, making it a hub for football matches, practice, and events. This lush facility promotes fitness and community through the beautiful game.";
const basketball_desc =
  "The basketball court at DBIT serves as a versatile sports arena, doubling as a rink football ground. It features a well-maintained playing surface suitable for both basketball and football activities, offering students and sports enthusiasts the flexibility to engage in their favorite sports within a single facility. We also have stands for seating.";
const topCourt_desc =
  "The Top Court, a versatile sports facility, doubles as a box cricket ground at our college campus. This well-maintained space is a focal point for cricket enthusiasts, offering an ideal setup for the fast-paced game. With marked boundaries and essential amenities, it provides the perfect environment for cricket matches and recreational activities, enhancing campus experience.";

class StudentGrounds extends Component {
  render() {
    return (
      <div>
        <StudentNavbar /> {/* Enclose the navbar at the top */}
        <div className="container-fluid d-flex justify-content-center">
          <div className="row">
            <div className="col-md-4">
              <StudentCards imgsrc={img1} title="Basketball Court" description={basketball_desc}>
                <Link to="/student-basketball">
                  <button className="btn btn-outline-success">Book Now</button>
                </Link>
              </StudentCards>
            </div>
            <div className="col-md-4">
              <StudentCards imgsrc={img2} title="Football Ground" description={football_desc}>
                <Link to="/student-football">
                  <button className="btn btn-outline-success">Book Now</button>
                </Link>
              </StudentCards>
            </div>
            <div className="col-md-4">
              <StudentCards imgsrc={img4} title="Top Court" description={topCourt_desc}>
                <Link to="/student-top">
                  <button className="btn btn-outline-success">Book Now</button>
                </Link>
              </StudentCards>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentGrounds;
