import React, {useState} from 'react';
import img2 from '../assets/img2.jpg'; // Import the background image
import BookingConfirmation from '../Components/BookingConfirmation';
import {
    getUserVariable,
    setVenueVariable,
    getVenueVariable,
    getLevelVariable,
    getEmailVariable,
    getNameVariable,
} from '../global';


function StudentBasketball() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');


    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = (value) => {
        setModalIsOpen(value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setVenueVariable(2);

        const selectedOption = JSON.parse(time);
        const startTime = selectedOption.start;
        const endTime = selectedOption.end;

        //converting react date format to mysql DATE datatype format
        const dt = new Date(date)
        const mysqlDate = dt.toISOString().slice(0, 10);

        //checking whether the date picked is withing 10 days from current date
        const currentDate = new Date();
        const tenDaysLater = new Date();
        tenDaysLater.setDate(currentDate.getDate() + 10);

        if (dt <= currentDate || dt > tenDaysLater) {
            alert("Choose a date within 10 days from now")
            return;
        } else {
            try {
                const checkData = {
                    date: mysqlDate,
                    start_time: startTime,
                    end_time: endTime,
                    venue_id: getVenueVariable(),
                }
                console.log('Working1');
                const response = await fetch(`http://localhost:3000/api/bookings/getBookingByDateTimeVenue`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(checkData),
                });
                console.log('Working2');
                const booking = await response.json();
                console.log('Working3');
                if (response.status === 200) {
                    if (booking.level >= getLevelVariable()) {
                        alert("Slot already full")
                    } else {
                        console.log('Working4');
                        try {
                            const footballData = {
                                user_id: getUserVariable(),
                                venue_id: getVenueVariable(),
                                level: getLevelVariable(),
                                date: mysqlDate,
                                start_time: startTime,
                                end_time: endTime,
                                status: 1,
                            };

                            fetch(`http://localhost:3000/api/bookings/deleteBooking`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(checkData),
                            })
                                .then(async (response) => {
                                    if (response.ok) {
                                        const response = await fetch(`http://localhost:3000/api/users/getUser/${booking.user_id}`);

                                        const user = await response.json();

                                        const mailData = {
                                            name: user.name,
                                            email: user.email,
                                            message: `${user.name} your booked slot for Basketball Court on ${booking.date} from ${booking.start_time} to ${booking.end_time} has been canceled due to booking by a higher authority.`,
                                        };

                                        try {
                                            const response = await fetch(`http://localhost:3000/bookingEmail`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(mailData),
                                            });

                                            if (response.status === 200) {
                                                console.log('Done');
                                            } else {
                                                console.error('Server error');
                                            }
                                        } catch (error) {
                                            console.error('An error occurred', error);
                                        }
                                        console.log('Booking deleted successfully');
                                    } else {
                                        alert('Failed to delete booking');
                                        console.error('Failed to delete booking');
                                        return;
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                });

                            const response = await fetch(`http://localhost:3000/api/bookings/addBooking`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(footballData),
                            });

                            if (response.status === 200) {

                                const mailData = {
                                    name: getNameVariable(),
                                    email: getEmailVariable(),
                                    message: `${getNameVariable()} you have booked the Basketball Court on ${date} from ${startTime} to ${endTime}`,
                                };

                                try {
                                    const response = await fetch(`http://localhost:3000/bookingEmail`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(mailData),
                                    });

                                    if (response.status === 200) {
                                        console.log('Done');
                                    } else {
                                        console.error('Server error');
                                    }
                                } catch (error) {
                                    console.error('An error occurred', error);
                                }

                                openModal(true);
                            } else {
                                console.error('Server error');
                            }
                        } catch (error) {
                            console.error('An error occurred', error);
                        }
                    }
                } else {
                    console.log('Working5');
                    try {
                        const footballData = {
                            user_id: getUserVariable(),
                            venue_id: getVenueVariable(),
                            level: getLevelVariable(),
                            date: mysqlDate,
                            start_time: startTime,
                            end_time: endTime,
                            status: 1,
                        };


                        const response = await fetch(`http://localhost:3000/api/bookings/addBooking`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(footballData),
                        });

                        if (response.status === 200) {
                            const mailData = {
                                name: getNameVariable(),
                                email: getEmailVariable(),
                                message: `${getNameVariable()} you have booked the Basketball Court on ${date} from ${startTime} to ${endTime}`,
                            };

                            try {
                                const response = await fetch(`http://localhost:3000/bookingEmail`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(mailData),
                                });

                                if (response.status === 200) {
                                    console.log('Done');
                                } else {
                                    console.error('Server error');
                                }
                            } catch (error) {
                                console.error('An error occurred', error);
                            }

                            openModal(true);
                        } else {
                            console.error('Server error');
                        }
                    } catch (error) {
                        console.error('An error occurred', error);
                    }
                }
            } catch (error) {
                console.error('An error occurred', error);
            }
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const containerStyles = {
        maxWidth: '800px', // Increased form width
        width: '700px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        maxHeight: '700px',
        height: 'auto', // Changed height to auto for dynamic sizing
        padding: '30px', // Increased padding
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.3)', // Added box shadow for a subtle effect
        flexDirection: 'column',
    };

    const inputStyles = {
        width: '100%',
        padding: '10px', // Adjusted padding
        marginTop: '10px', // Increased margin-top
        marginBottom: '10px', // Added margin-bottom

        borderRadius: '10px', // Increased border radius
        fontSize: '16px', // Increased font size for better readability
    };

    const nameEmailContainerStyles = {
        display: 'flex',
        flexWrap: 'nowrap', // Allow wrapping on smaller screens
        justifyContent: 'space-between',
    };

    const nameInputStyles = {
        flex: 1,
        marginRight: '10px', // Adjust margin as needed
    };

    const dateTimeContainerStyles = {
        display: 'flex',
        flexWrap: 'nowrap', // Allow wrapping on smaller screens
        justifyContent: 'space-between',
    };

    const dateInputStyles = {
        flex: 1,
        marginRight: '20px', // Adjust margin as needed
    };
    const timeInputStyles = {
        flex: 1,
    };
    const buttonStyles = {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '10px', // Increased border radius
        padding: '12px 24px', // Adjusted padding for the button
        cursor: 'pointer',
        fontSize: '18px', // Increased font size for the button
    };
    /* Add styles for terms and conditions alignment */
    const termsContainerStyles = {
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px', // Adjust spacing
    };

    /* Add styles for the terms and conditions checkbox */
    const termsCheckboxStyles = {
        marginRight: '5px', // Adjust spacing
    };

    const submitButtonStyles = {
        ...buttonStyles, // Spread the buttonStyles object to inherit its properties
        backgroundColor: '#007bff',
        color: '#fff',
    };

    const submitButtonHoverStyles = {
        ...submitButtonStyles, // Spread the submitButtonStyles object to inherit its properties
        backgroundColor: '#0056b3',
    };

    const backgroundStyles = {
        margin: 0,
        padding: 0,
        backgroundImage: `url(${img2})`, // Set the background image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#fff',
    };

    return (
        <div style={backgroundStyles}>
            <div className="football-container" style={containerStyles}>
                <h2>Book Basketball Court</h2>
                <form onSubmit={handleSubmit}>
                    <div className="date-time-container" style={dateTimeContainerStyles}>
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
                                Time Slot:
                                <select
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                    style={inputStyles}
                                >
                                    <option value="" disabled>Select Time Slot</option>
                                    <option value='{"start": "1330", "end": "1400"}'>13:30 to 14:00</option>
                                    <option value='{"start": "1600", "end": "1630"}'>16:00 to 16:30</option>
                                    <option value='{"start": "1630", "end": "1700"}'>16:30 to 17:00</option>
                                    <option value='{"start": "1700", "end": "1730"}'>17:00 to 17:30</option>
                                    <option value='{"start": "1730", "end": "1800"}'>17:30 to 18:00</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <button type="submit" style={submitButtonStyles} onClick={openModal}>
                        Book Court
                    </button>
                    <BookingConfirmation isOpen={modalIsOpen} onClose={closeModal}/>
                </form>
            </div>
        </div>
    );
}

export default StudentBasketball;
