import React, { Component } from "react";
// import Card from '../Dashboard/CardUI'
import Card from "../dhruuv/venue_cards";


class Cards extends Component {
  constructor() {
    super();
    this.state = {
      venues: [], // Initialize an empty array to store the fetched venues
      loading: true, // Initialize the loading state
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/venues/allGrounds",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        this.setState({ venues: data, loading: false }); // Update the state with the fetched data and set loading to false
      } else {
        console.error("Failed to fetch data");
        this.setState({ loading: false }); // Update loading state even in case of an error
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
      this.setState({ loading: false }); // Update loading state in case of an exception
    }
  }
  render() {
    const { loading, venues } = this.state;
    return (
      <div className="container-fluid d-flex justify-content-center">
        <div className="row">
          {loading ? (
            <p>Loading...</p>
          ) : (
            venues.map((venue) => (
              <div className="col mb-4">
                <Card
                  key={venue._id}
                  title={venue.name}
                  description={venue.description}
                  imgsrc={`http://localhost:3000/static/${venue.imgPath}`}
                />
              </div>
            ))
          )}         
        </div>
      </div>
    );
  }
}
export default Cards;
