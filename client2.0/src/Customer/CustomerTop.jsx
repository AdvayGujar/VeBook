import React, {useState, useEffect} from 'react';
import img2 from '../assets/img4.jpg'; // Import the background image
import BookingConfirmation from '../Components/BookingConfirmation';
import {
    getUserVariable,
    setVenueVariable,
    getVenueVariable,
    getLevelVariable,
    getEmailVariable,
    getNameVariable,
} from '../global';
import {Link, useNavigate} from 'react-router-dom';



function CustomerTop() {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [bookings, setBookings] = useState([]);


    const [modalIsOpen, setModalIsOpen] = useState(false);
    const history = useNavigate();

    const openModal = (value) => {
        setModalIsOpen(value);
    };

    const fetchBookings = async (selectedDate) => {
        const dt = new Date(selectedDate)
        const mysqlDate = dt.toISOString().slice(0, 10);

        try {
            // Assume this is an API endpoint to fetch bookings for a specific date
            const response = await fetch(`http://localhost:3000/api/bookings/getAllBookingsByDate/${mysqlDate}`);
            const data = await response.json();
            if (!response.ok) {
                setBookings([]);
                throw new Error('Failed to fetch data');
            }

            const filteredBookings = data.filter(booking => booking.venue_id === 3 && booking.level >= getLevelVariable());

            setBookings(filteredBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // Handle errors, e.g., display an error message to the user
        }
    };

    const handleDateSelection = (selectedDate) => {
        setDate(selectedDate);
        fetchBookings(selectedDate); // Fetch bookings when a new date is selected
    };


    const renderTimeSlots = () => {
        const timeSlots = [];
        for (let i = 8; i <= 21; i++) {
            const hour = i < 10 ? '0' + i : i;
            const slotStartTime = `${hour}00`;
            const slotEndTime = `${i + 1 < 10 ? '0' + (i + 1) : i + 1}00`;
            console.log(bookings);
            const isBooked = bookings.some(booking =>
                (
                    (booking.start_time >= slotStartTime && booking.end_time <= slotEndTime) && // Case 1
                    (booking.status === 1 || booking.status === 3)
                ) ||
                (
                    (booking.start_time < slotStartTime && booking.end_time > slotEndTime) && // Case 1
                    (booking.status === 1 || booking.status === 3)
                ) ||
                (
                    (booking.start_time < slotStartTime && booking.end_time <= slotEndTime &&
                        booking.end_time > slotStartTime) && // Case 2
                    (booking.status === 1 || booking.status === 3)
                ) ||
                (
                    (booking.start_time >= slotStartTime && booking.start_time < slotEndTime &&
                        booking.end_time > slotEndTime) && // Case 3
                    (booking.status === 1 || booking.status === 3)
                )
            );
            timeSlots.push(
                <tr key={i}>
                    <td style={{backgroundColor: isBooked ? 'blue' : 'transparent'}}> {slotStartTime}</td>
                    <td style={{backgroundColor: isBooked ? 'blue' : 'transparent'}}> {slotEndTime}</td>
                    <td style={{backgroundColor: isBooked ? 'blue' : 'transparent'}}>
                        {isBooked ? 'Booked' : 'Available'}
                    </td>
                </tr>
            );
        }
        return timeSlots;
    };

    const timeSlots = date ? renderTimeSlots() : null;

    // UseEffect to trigger fetching when the date changes
    useEffect(() => {
        if (date) {
            fetchBookings(date); // Fetch bookings when the date changes
            console.log(bookings);
        }
    }, [date]);

    const generateStartTimeOptions = () => {
        const options = [];
        for (let i = 8; i <= 21; i++) {
            let hour = i < 10 ? '0' + i : i;
            let ampm = i < 12 ? 'A.M.' : 'P.M.';
            options.push(
                <option key={i} value={`${hour}00`}>{hour}:00 {ampm}</option>
            );
        }
        return options;
    };

    const generateEndTimeOptions = () => {
        const options = [];
        for (let i = 9; i <= 22; i++) {
            let hour = i < 10 ? '0' + i : i;
            let ampm = i < 12 ? 'A.M.' : 'P.M.';
            options.push(
                <option key={i} value={`${hour}00`}>{hour}:00 {ampm}</option>
            );
        }
        return options;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setVenueVariable(3);

        //converting react date format to mysql DATE datatype format
        const dt = new Date(date)
        const mysqlDate = dt.toISOString().slice(0, 10);

        //checking whether the date picked is withing 10 days from current date
        const currentDate = new Date();
        const tenDaysLater = new Date();
        tenDaysLater.setDate(currentDate.getDate() + 92);

        if (dt <= currentDate || dt > tenDaysLater) {
            alert("Choose a date within three months from now")
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
                    alert("Slot already full")
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
                            status: 3,
                        };


                        const response = await fetch(`http://localhost:3000/api/bookings/addBooking`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(footballData),
                        });

                        if (response.status === 200) {
                            openModal(true);

                            const mailData = {
                                name: getNameVariable(),
                                email: getEmailVariable(),
                                message: `${getNameVariable()}, your request to book the Top Court on ${date} from ${startTime} to ${endTime} has been received`,
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
                            history('/customer-dashboard');
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

    const dateTimeContainerStyles = {
        display: 'flex',
        flexWrap: 'nowrap', // Allow wrapping on smaller screens
        justifyContent: 'space-between',
    };

    const dateInputStyles = {
        flex: 1,
        marginRight: '20px', // Adjust margin as needed
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

    const submitButtonStyles = {
        ...buttonStyles, // Spread the buttonStyles object to inherit its properties
        backgroundColor: '#007bff',
        color: '#fff',
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
                <h2>Book Top Court</h2>
                <form onSubmit={handleSubmit}>
                    <div className="date-time-container" style={dateTimeContainerStyles}>
                        <div className="date-input" style={dateInputStyles}>
                            <label>
                                Date:
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => handleDateSelection(e.target.value)}
                                    required
                                    style={inputStyles}
                                />
                            </label>
                        </div>
                        <div className="time-input" style={dateInputStyles}>
                            <label>
                                Start Time:
                                <select
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    style={inputStyles}
                                >
                                    <option value="" disabled>Select Start Time</option>
                                    {generateStartTimeOptions()}
                                </select>
                            </label>
                        </div>
                        <div className="time-input" style={dateInputStyles}>
                            <label>
                                End Time:
                                <select
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    style={inputStyles}
                                >
                                    <option value="" disabled>Select End Time</option>
                                    {generateEndTimeOptions()}
                                </select>
                            </label>
                        </div>
                        <table>
                            <thead>
                            <tr>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>{timeSlots}</tbody>
                        </table>
                    </div>
                    <button type="submit" style={submitButtonStyles}>
                        Book Court
                    </button>
                    <BookingConfirmation isOpen={modalIsOpen} onClose={closeModal}/>
                </form>
            </div>
        </div>
    );
}

export default CustomerTop;
