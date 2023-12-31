import React, {Component} from 'react';
import * as XLSX from 'xlsx';
import backgroundImage from '../assets/stats.png'; // Import the image
import md5 from 'md5';
import {
    getUserVariable,
    setUserVariable,
    setLevelVariable,
    getLevelVariable,
    getNameVariable,
    getEmailVariable
} from '../global';

const venueMapping = {
    1: 'Football Ground',
    2: 'Basketball Court',
    3: 'Top Court',
    4: 'Mondini Hall',
    5: 'Seminar Hall',
    // Add more mappings as needed
};

const statusMapping = {
    1: 'Active',
    0: 'Cancelled',
    2: 'Elapsed',
    3: 'Pending',
};

const levelMapping = {
    1: 'Student',
    2: 'Management',
    3: 'Faculty',
    4: 'Father',
    5: 'Customer',
};

const fetchUserNameById = async (userId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/getUser/${userId}`); // Replace with the correct endpoint for fetching user details
        if (!response.ok) {
            console.log('Failed to fetch user data');
        }
        const userData = await response.json();
        return userData.name;
    } catch (error) {
        console.error(error);
        return 'Unknown User'; // Return a default value or handle the error accordingly
    }
};

const formatTime = (timeInt) => {
  const timeString = timeInt.toString(); // Convert the integer to a string
  const formattedTime =
    timeString.substring(0, timeString.length - 2) +
    ':' +
    timeString.substring(timeString.length - 2); // Format the time as 'hh:mm'
  return formattedTime;
};

const styles = {
    container: {
        display: 'flex',
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f7f7f7',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        padding: '20px', // Added padding to the header section
    },
    leftSection: {
        flex: 1,
        width: '100%',
        maxWidth: '60%',
        padding: '20px', // Added padding to the left section
    },
    rightSection: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Align content to the top
        alignItems: 'center',
    },
    heading: {
        fontSize: '36px',
        marginBottom: '20px',
        color: '#000',
    },
    fileInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '20px 0', // Added padding to the file input container
    },
    fileInput: {
        display: 'none',
    },
    chooseFileButton: {
        backgroundColor: '#3498db',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '10px',
    },
    backgroundImage: {
        width: '70%',
        height: '400px',
    },
    table: {
        borderCollapse: 'collapse',
        width: '100%',
        marginBottom: '30px', // This is the margin at the bottom of the table
        marginLeft: '0', // Adjust the left margin (default is '0')
        marginRight: '0', // Adjust the right margin (default is '0')
    },
    tableHeader: {
        background: '#3498db',
        color: 'white',
    },
    tableHeaderCell: {
        padding: '5px',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    tableCell: {
        padding: '5px',
        borderBottom: '1px solid #ddd',
    },
    tableSection: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    button: {
        backgroundColor: '#3498db',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s', // Added transition for smooth hover effect
    },

    // Add a hover effect for buttons
    'button:hover': {
        backgroundColor: '#2980b9', // Change the background color on hover
    },
};

class AdminDashboard extends Component {
    constructor() {
        super();
        this.state = {
            bookingHistory: [],
            pendingApprovals: [],
            userData: [],
            recentBookings: [],
        };
    }

    componentDidMount() {
        this.fetchRecentBookings();
        this.fetchBookingHistory();
    }

    async fetchRecentBookings() {
        try {
            const response = await fetch(`http://localhost:3000/api/bookings/allBookings`);
            if (!response.ok) {
                console.log('Failed to fetch data');
            }
            const data = await response.json();

            // Map venue_id to venue names
            const bookingsWithVenueNames = data.map((booking) => {
                return {
                    ...booking,
                    venue: venueMapping[booking.venue_id] || 'Unknown Venue',
                    status: statusMapping[booking.status] || 'Unknown Status',
                    level: levelMapping[booking.level] || 'Unknown Level',
                    start_time: formatTime(booking.start_time),
                    end_time: formatTime(booking.end_time),
                };
            });

            const pendingApprovals = bookingsWithVenueNames.filter((booking) => booking.status === 'Pending'); // Change 'Pending' as per the status fetched

            const pendingApprovalsWithUserNames = await Promise.all(
                pendingApprovals.map(async (booking) => {
                    const userName = await fetchUserNameById(booking.user_id);
                    return {...booking, user: userName};
                })
            );

            this.setState({pendingApprovals: pendingApprovalsWithUserNames});
        } catch (error) {
            console.error(error);
        }
    }

    async fetchBookingHistory() {
        try {
            const response = await fetch(`http://localhost:3000/api/bookings/allBookings`);
            if (!response.ok) {
                console.log('Failed to fetch data');
            }
            const data = await response.json();

            // Map venue_id to venue names
            const bookingsWithVenueNames = data.map((booking) => {
                return {
                    ...booking,
                    venue: venueMapping[booking.venue_id] || 'Unknown Venue',
                    status: statusMapping[booking.status] || 'Unknown Status',
                    start_time: formatTime(booking.start_time),
                    end_time: formatTime(booking.end_time),
                };
            });

            const pendingApprovalsWithUserNames = await Promise.all(
                bookingsWithVenueNames.map(async (booking) => {
                    const userName = await fetchUserNameById(booking.user_id);
                    return {...booking, user: userName};
                })
            );

            pendingApprovalsWithUserNames.sort((a, b) => new Date(b.date) - new Date(a.date));

            const limitedBookings = pendingApprovalsWithUserNames.slice(0, 15);

            this.setState({bookingHistory: limitedBookings});
        } catch (error) {
            console.error(error);
        }
    }

    handleFileUpload = (event) => {
        const inputElement = event.target;
        const file = inputElement.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, {type: 'binary'});
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const userData = XLSX.utils.sheet_to_json(sheet, {header: 1});

                // Assuming the first row contains headers and the data starts from the second row
                const formattedUserData = userData.slice(1).map((row) => ({
                    name: row[0],
                    md5Password: md5(row[1]), // Use your preferred password hashing method
                    email: row[2],
                    department: row[3],
                    level: row[4],
                }));

                // Send the formatted user data to the server
                fetch('http://localhost:3000/api/users/addUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({users: formattedUserData}),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Users added:', data);
                        // Optionally, update state or UI to indicate successful upload
                    })
                    .catch((error) => {
                        console.error('Error adding users:', error);
                        // Handle error, e.g., display an error message to the user
                    });
            };

            reader.readAsBinaryString(file);
        }
    }

    approveBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/bookings/pendingBooking/${bookingId}`, {
                method: 'DELETE', // or 'DELETE' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to approve booking');
            }

            const bookingResponse = await fetch(`http://localhost:3000/api/bookings/getBookingById/${bookingId}`)
            if (!bookingResponse.ok) {
                throw new Error('Failed to fetch booking details');
            }

            const bookingData = await bookingResponse.json();
            const userId = bookingData.user_id;
            const date = bookingData.date;
            const startTime = bookingData.start_time;
            const endTime = bookingData.end_time;

            const userResponse = await fetch(`http://localhost:3000/api/users/getUser/${userId}`);
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user details');
            }

            const userData = await userResponse.json();
            const userEmail = userData.email;
            const userName = userData.name;

            const mailData = {
                name: userName,
                email: userEmail,
                message: `${userName} you have booked the Football Ground on ${date} from ${startTime} to ${endTime}`,
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
            // If the approval was successful, update the pending approvals
            this.fetchRecentBookings(); // Call the function to fetch updated pending approvals
            this.fetchBookingHistory();
        } catch (error) {
            console.error(error);
        }
    }
    handleDenyBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/bookings/deleteBooking/${bookingId}`, {
                method: 'DELETE', // or 'DELETE' depending on your API
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to approve booking');
            }

            const bookingResponse = await fetch(`http://localhost:3000/api/bookings/getBookingById/${bookingId}`)
            if (!bookingResponse.ok) {
                throw new Error('Failed to fetch booking details');
            }

            const bookingData = await bookingResponse.json();
            const userId = bookingData.user_id;
            const date = bookingData.date;
            const startTime = bookingData.start_time;
            const endTime = bookingData.end_time;

            const userResponse = await fetch(`http://localhost:3000/api/users/getUser/${userId}`);
            if (!userResponse.ok) {
                throw new Error('Failed to fetch user details');
            }

            const userData = await userResponse.json();
            const userEmail = userData.email;
            const userName = userData.name;

            const mailData = {
                name: userName,
                email: userEmail,
                message: `${userName} your requested booking for the Football Ground on ${date} from ${startTime} to ${endTime} has been denied`,
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
            // If the approval was successful, update the pending approvals
            this.fetchRecentBookings(); // Call the function to fetch updated pending approvals
            this.fetchBookingHistory();
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.leftSection}>
                        <h1 style={{...styles.heading, fontSize: '40px', color: '#333'}}>Welcome to Admin
                            Dashboard!!</h1>

                        <div style={styles.fileInputContainer}>
                            <label htmlFor="fileInput" style={styles.chooseFileButton}>
                                Choose File
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                accept=".xlsx"
                                onChange={this.handleFileUpload}
                                style={styles.fileInput}
                            />
                        </div>

                        <p style={{padding: '20px 0', fontSize: '18px'}}>Upload an Excel file containing user
                            information (xlsx format).</p>

                        {this.state.userData.length > 0 && (
                            <div>
                                <h2>User Data from Excel</h2>
                                <table style={styles.table}>
                                    <thead style={styles.tableHeader}>
                                    <tr>
                                        <th style={styles.tableHeaderCell}>Name</th>
                                        <th style={styles.tableHeaderCell}>Password</th>
                                        <th style={styles.tableHeaderCell}>Email</th>
                                        <th style={styles.tableHeaderCell}>Department</th>
                                        <th style={styles.tableHeaderCell}>Level</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.userData.map((user, index) => (
                                        <tr key={index}>
                                            <td style={styles.tableCell}>{user.Name}</td>
                                            <td style={styles.tableCell}>{user.Password}</td>
                                            <td style={styles.tableCell}>{user.Email}</td>
                                            <td style={styles.tableCell}>{user.Department}</td>
                                            <td style={styles.tableCell}>{user.Level}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div style={styles.rightSection}>
                        <img src={backgroundImage} alt="Background" style={styles.backgroundImage}/>
                    </div>
                </div>
                <div style={styles.tableSection}>
                    <h2 style={{...styles.tableHeaderCell, marginLeft: '20px'}}>Recent Bookings Awaiting Approval</h2>
                    <table style={{...styles.table, width: '80%', margin: '0 auto', border: '1px solid #000'}}>
                        <thead style={styles.tableHeader}>
                        <tr>
                            <th style={styles.tableHeaderCell}>Booking ID</th>
                            <th style={styles.tableHeaderCell}>User</th>
                            <th style={styles.tableHeaderCell}>Level</th>
                            <th style={styles.tableHeaderCell}>Venue</th>
                            <th style={styles.tableHeaderCell}>Date</th>
                            <th style={styles.tableHeaderCell}>Start Time</th>
                            <th style={styles.tableHeaderCell}>End Time</th>
                            <th style={styles.tableHeaderCell}>Status</th>
                            <th style={styles.tableHeaderCell}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.pendingApprovals.map((booking, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{booking.id}</td>
                                <td style={styles.tableCell}>{booking.user}</td>
                                <td style={styles.tableCell}>{booking.level}</td>
                                <td style={styles.tableCell}>{booking.venue}</td>
                                <td style={styles.tableCell}>{booking.date}</td>
                                <td style={styles.tableCell}>{booking.start_time}</td>
                                <td style={styles.tableCell}>{booking.end_time}</td>
                                <td style={styles.tableCell}>{booking.status}</td>
                                <td style={styles.tableCell}>
                                    <button
                                        style={{
                                            ...styles.button,
                                            backgroundColor: '#27ae60',
                                            marginRight: '5px', // Add margin to the right
                                        }}
                                        onClick={() => this.approveBooking(booking.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        style={{
                                            ...styles.button,
                                            backgroundColor: '#e74c3c',
                                        }}
                                        onClick={() => this.handleDenyBooking(booking.id)}
                                    >
                                        Deny
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <h2 style={{...styles.tableHeaderCell, marginLeft: '20px',}}>Booking History</h2>
                    <table style={{...styles.table, width: '80%', margin: '0 auto', border: '1px solid #000'}}>
                        <thead style={styles.tableHeader}>
                        <tr>
                            <th style={styles.tableHeaderCell}>Booking ID</th>
                            <th style={styles.tableHeaderCell}>User</th>
                            <th style={styles.tableHeaderCell}>Venue</th>
                            <th style={styles.tableHeaderCell}>Date</th>
                            <th style={styles.tableHeaderCell}>Start Time</th>
                            <th style={styles.tableHeaderCell}>End Time</th>
                            <th style={styles.tableHeaderCell}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.bookingHistory.map((booking, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{booking.id}</td>
                                <td style={styles.tableCell}>{booking.user}</td>
                                <td style={styles.tableCell}>{booking.venue}</td>
                                <td style={styles.tableCell}>{booking.date}</td>
                                <td style={styles.tableCell}>{booking.start_time}</td>
                                <td style={styles.tableCell}>{booking.end_time}</td>
                                <td style={styles.tableCell}>{booking.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default AdminDashboard;
