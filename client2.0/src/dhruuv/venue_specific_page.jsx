import React, {useState, useEffect} from "react";
// import img2 from "../assets/img2.jpg"; // Import the background image
import BookingConfirmation from "../Components/BookingConfirmation";
import {useParams, Link, useNavigate} from "react-router-dom";
import {
    getUserVariable,
    setVenueVariable,
    getVenueVariable,
    getLevelVariable,
    getEmailVariable,
    getNameVariable,
} from "../global";

function FacultyFootball() {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const history = useNavigate();
    const openModal = (value) => {
        setModalIsOpen(value);
    };

    const start = (startTime) => {
        const [hourStr, minuteStr] = startTime.split(":");
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        // Check if it's p.m. and adjust the hour accordingly
        let adjustedHour = hour;
        if (startTime.includes("PM")) {
            adjustedHour = hour === 12 ? 12 : hour + 12;
        } else if (startTime.includes("AM") && hour === 12) {
            adjustedHour = 0;
        }

        // Convert the hour and minute to a 24-hour format integer (HHMM)
        const timeAsInteger = adjustedHour * 100 + minute;
        console.log(timeAsInteger);
        // Update the state with the formatted time
        return timeAsInteger;
    };

    const end = (endTime) => {
        const [hourStr, minuteStr] = endTime.split(":");
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        // Check if it's p.m. and adjust the hour accordingly
        let adjustedHour = hour;
        if (endTime.includes("PM")) {
            adjustedHour = hour === 12 ? 12 : hour + 12;
        } else if (endTime.includes("AM") && hour === 12) {
            adjustedHour = 0;
        }

        // Convert the hour and minute to a 24-hour format integer (HHMM)
        const timeAsInteger = adjustedHour * 100 + minute;

        // Update the state with the formatted time
        return timeAsInteger;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setVenueVariable(1);

        //converting react date format to mysql DATE datatype format
        const dt = new Date(date);
        const mysqlDate = dt.toISOString().slice(0, 10);

        //checking whether the date picked is withing 10 days from current date
        const currentDate = new Date();
        const tenDaysLater = new Date();
        tenDaysLater.setDate(currentDate.getDate() + 62);

        if (dt <= currentDate || dt > tenDaysLater) {
            alert("Choose a date within two months from now");
            return;
        } else {
            try {
                const checkData = {
                    date: mysqlDate,
                    start_time: start(startTime),
                    end_time: end(endTime),
                    venue_id: getVenueVariable(),
                };
                console.log("Working1");
                const response = await fetch(
                    `http://localhost:3000/api/bookings/getBookingByDateTimeVenue`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(checkData),
                    }
                );
                console.log("Working2");
                const booking = await response.json();
                console.log("Working3");
                if (response.status === 200) {
                    if (booking.level >= getLevelVariable()) {
                        alert("Slot already full");
                    } else {
                        console.log("Working4");
                        try {
                            const footballData = {
                                user_id: getUserVariable(),
                                venue_id: getVenueVariable(),
                                level: getLevelVariable(),
                                date: mysqlDate,
                                start_time: start(startTime),
                                end_time: end(endTime),
                                status: 1,
                            };

                            fetch(
                                `http://localhost:3000/api/bookings/deleteBooking/${booking.id}`,
                                {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            )
                                .then(async (response) => {
                                    if (response.ok) {
                                        const response = await fetch(
                                            `http://localhost:3000/api/users/getUser/${booking.user_id}`
                                        );

                                        const user = await response.json();

                                        const mailData = {
                                            name: user.name,
                                            email: user.email,
                                            message: `${user.name} your booked slot for Football Ground on ${booking.date} from ${booking.start_time} to ${booking.end_time} has been canceled due to booking by a higher authority.`,
                                        };

                                        try {
                                            const response = await fetch(
                                                `http://localhost:3000/bookingEmail`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify(mailData),
                                                }
                                            );

                                            if (response.status === 200) {
                                                console.log("Done");
                                            } else {
                                                console.error("Server error");
                                            }
                                        } catch (error) {
                                            console.error("An error occurred", error);
                                        }
                                        console.log("Booking deleted successfully");
                                    } else {
                                        alert("Failed to delete booking");
                                        console.error("Failed to delete booking");
                                        return;
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error:", error);
                                });

                            const response = await fetch(
                                `http://localhost:3000/api/bookings/addBooking`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(footballData),
                                }
                            );

                            if (response.status === 200) {
                                const mailData = {
                                    name: getNameVariable(),
                                    email: getEmailVariable(),
                                    message: `${getNameVariable()} you have booked the Football Ground on ${date} from ${startTime} to ${endTime}`,
                                };

                                try {
                                    const response = await fetch(
                                        `http://localhost:3000/bookingEmail`,
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify(mailData),
                                        }
                                    );

                                    if (response.status === 200) {
                                        console.log("Done");
                                    } else {
                                        console.error("Server error");
                                    }
                                } catch (error) {
                                    console.error("An error occurred", error);
                                }

                                openModal(true);
                            } else {
                                console.error("Server error");
                            }
                        } catch (error) {
                            console.error("An error occurred", error);
                        }
                    }
                } else {
                    console.log("Working5");
                    try {
                        const footballData = {
                            user_id: getUserVariable(),
                            venue_id: getVenueVariable(),
                            level: getLevelVariable(),
                            date: mysqlDate,
                            start_time: start(startTime),
                            end_time: end(endTime),
                            status: 1,
                        };

                        const response = await fetch(
                            `http://localhost:3000/api/bookings/addBooking`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(footballData),
                            }
                        );

                        if (response.status === 200) {
                            const mailData = {
                                name: getNameVariable(),
                                email: getEmailVariable(),
                                message: `${getNameVariable()} you have booked the Football Ground on ${date} from ${startTime} to ${endTime}`,
                            };

                            try {
                                const response = await fetch(
                                    `http://localhost:3000/bookingEmail`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(mailData),
                                    }
                                );

                                if (response.status === 200) {
                                    console.log("Done");
                                } else {
                                    console.error("Server error");
                                }
                            } catch (error) {
                                console.error("An error occurred", error);
                            }

                            openModal(true);
                        } else {
                            console.error("Server error");
                        }
                    } catch (error) {
                        console.error("An error occurred", error);
                    }
                }
            } catch (error) {
                console.error("An error occurred", error);
            }
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };
    const redirectToLogin = () => {
        history("/logins");
    };
    const venue_id = useParams().id;
    const [venue, setVenue] = useState({
        id: null,
        name: "Loading...",
        imgPath: "/dbit.webp",
        description: "Loading...",
        // ...other properties
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/venues/${venue_id}`,
                    {
                        method: "GET",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setVenue(data);
                    setLoading(false);
                } else {
                    console.error("Failed to fetch data");
                    setLoading(true);
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
                setLoading(true);
            }
        }

        if (venue.name === "Loading...") {
            console.log("Loading");
            setLoading(false);
        }
        fetchData();
    }, [venue_id]);

    const containerStyles = {
        maxWidth: "800px", // Increased form width
        width: "700px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        maxHeight: "700px",
        height: "auto", // Changed height to auto for dynamic sizing
        padding: "30px", // Increased padding
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)", // Added box shadow for a subtle effect
        flexDirection: "column",
    };

    const inputStyles = {
        width: "100%",
        padding: "10px", // Adjusted padding
        marginTop: "10px", // Increased margin-top
        marginBottom: "10px", // Added margin-bottom

        borderRadius: "10px", // Increased border radius
        fontSize: "16px", // Increased font size for better readability
    };

    const dateTimeContainerStyles = {
        display: "flex",
        flexWrap: "nowrap", // Allow wrapping on smaller screens
        justifyContent: "space-between",
    };

    const dateInputStyles = {
        flex: 1,
        marginRight: "20px", // Adjust margin as needed
    };

    const img = `http://localhost:3000/static/${venue.imgPath}`;
    const backgroundStyles = {
        margin: 0,
        padding: 0,
        backgroundImage: `url(${img})`, // Set the background image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        color: "#fff",
    };

    const submitButtonStyles = {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "10px", // Increased border radius
        padding: "12px 24px", // Adjusted padding for the button
        fontSize: "18px",
        marginTop: "1rem",
    };

    const isActive = {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "10px", // Increased border radius
        padding: "12px 24px", // Adjusted padding for the button
        cursor: "not-allowed",
        opacity: 0.6,
        PointerEvents: "none",
        fontSize: "18px",
        marginTop: "1.5rem",
    };

    const contentStyles = {
        maxWidth: "800px", // Decrease the container width
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        padding: "40px", // Increase the padding
        borderRadius: "20px",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        marginTop: "20px", // Adjust spacing
        color: "#fff",
        display: "flex", // Display image and description side by side
        flexDirection: "column", // Stack children vertically
        alignItems: "center", // Center horizontally
    };

    const imageStyles = {
        maxWidth: "50%", // Decrease the image size
        height: "auto",
    };

    const descriptionStyles = {
        textAlign: "left",
        marginLeft: "20px",
        padding: "20px 20px", // Add margin to separate image and description
    };

    // Media Query for smaller screens
    const mediaQueryStyles = {
        "@media (max-width: 566px)": {
            imageStyles: {
                maxWidth: "90%", // Increase the width of the image for smaller screens
            },
            descriptionStyles: {
                padding: "10px", // Remove padding from the sides for description
            },
        },
    };

    return (
        <div style={backgroundStyles}>
            <div style={contentStyles}>
                <img
                    src={img}
                    alt={venue.name}
                    style={{...imageStyles, ...mediaQueryStyles.imageStyles}}
                />
                <div
                    style={{
                        ...descriptionStyles,
                        ...mediaQueryStyles.descriptionStyles,
                    }}
                >
                    <h2>{venue.name}</h2>
                    <p>{venue.description}</p>
                    {/* <p>{venueDetails.location}</p>
            <p>{venueDetails.capacity}</p>
            <p>{venueDetails.openHours}</p> */}
                </div>
                <form onSubmit={handleSubmit}>
                    {/* <div
              className="date-time-container"
              style={dateTimeContainerStyles}
            >
              <div className="date-input" style={dateInputStyles}>
                <label>
                  Date:
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={inputStyles}
                  />
                </label>
              </div>
              <div className="time-input" style={dateInputStyles}>
                <label>
                  Start Time:
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    style={inputStyles}
                  />
                </label>
              </div>
              <div className="time-input" style={dateInputStyles}>
                <label>
                  End Time:
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    style={inputStyles}
                  />
                </label>
              </div>
            </div> */}
                    {/* <button
            type="submit"
            style={(submitButtonStyles, isActive)}
            onClick={openModal}
          >
            Book
          </button> */}
                    {loading ? (
                        <button style={submitButtonStyles} disabled>
                            Loading...
                        </button>
                    ) : (
                        <button
                            type="submit"
                            style={submitButtonStyles}
                            // onClick={openModal}
                            onClick={redirectToLogin}
                        >
                            Login to continue
                        </button>
                    )}
                    <BookingConfirmation isOpen={modalIsOpen} onClose={closeModal}/>
                </form>
            </div>
        </div>
    );
}

export default FacultyFootball;
// duwahsdk