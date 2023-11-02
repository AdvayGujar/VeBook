import React, { Component } from "react";
import CustomerCards from "./CustomerCards";
import { Link } from "react-router-dom";
import img3 from "../assets/img3.jpg";
import img5 from "../assets/img5.jpg";
import CustomerNavbar from "./CustomerNavbar";

const mondini_desc =
  "Our fully equipped Mondini hall offers a dynamic space for a range of events. It features comfortable chairs, a high-quality microphone and speaker system, a professional DJ setup, captivating disco lights, and a powerful projector. Whether for conferences, parties, or presentations, this versatile hall ensures a seamless and engaging experience for your gatherings.";
const seminar_desc =
  "Our seminar hall is thoughtfully designed for a variety of educational and corporate events. It provides comfortable seating with chairs and comes equipped with a high-quality microphone and speaker system. Additionally, a projector is available to facilitate presentations and discussions, ensuring a conducive environment for knowledge sharing and engagement.";

class CustomerHalls extends Component {
  render() {
    return (
      <div>
        <CustomerNavbar />
        <div className="container-fluid d-flex justify-content-center">
          <div className="row">
            <div className="col-md-6">
              <CustomerCards imgsrc={img3} title="Seminar Hall" description={seminar_desc}>
                <Link to="/customer-seminar">
                  <button className="btn btn-outline-success">Book Now</button>
                </Link>
              </CustomerCards>
            </div>
            <div className="col-md-6">
              <CustomerCards imgsrc={img5} title="Mondini Hall" description={mondini_desc}>
                <Link to="/customer-mondini">
                  <button className="btn btn-outline-success">Book Now</button>
                </Link>
              </CustomerCards>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerHalls;
