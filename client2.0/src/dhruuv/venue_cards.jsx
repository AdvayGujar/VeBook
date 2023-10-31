import React from "react";
import "../Dashboard/.card-style.css";
import { Link } from "react-router-dom";

const Card = (props) => {
  const path = `/${props.title.toLowerCase().replace(/\s/g, "-")}`;
  const receivedData = {
    id: props.id,
    name: props.name,
    imgPath: props.imgPath,
    description: props.description,
  };
  const dataString = JSON.stringify(receivedData);
  return (
    <div className="cards">
      <div className="card text-center shadow">
        <div className="overflow">
          <img src={props.imgsrc} alt="Image1" className="card-img-top" />
        </div>
        <div className="card-body text-dark">
          <h4 className="card-title">{props.title}</h4>
          <p className="card-text text-secondary">{props.description}</p>
          {/* <Link to={path}>
          <button className='btn btn-outline-success'>Book Now</button>
        </Link> */}
          {/* <Link
            to={`/test`}
            id={receivedData.id}
            name={receivedData.name}
            imgPath={receivedData.imgPath}
            description={receivedData.description}
          > */}
          <Link
            to={`/test/${receivedData.id}`}
           
          >
            <button className="btn btn-outline-success">Book Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;