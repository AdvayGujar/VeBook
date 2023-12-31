import React from "react";

function StudentCards({ imgsrc, title, description, children }) {
  return (
    <div className="cards">
      <div className="card text-center shadow">
        <div className="overflow">
          <img src={imgsrc} alt={title} className="card-img-top" />
        </div>
        <div className="card-body text-dark">
          <h4 className="card-title">{title}</h4>
          <p className="card-text text-secondary">{description}</p>
          {children} {/* Render the child component (Link) */}
        </div>
      </div>
    </div>
  );
}

export default StudentCards;
