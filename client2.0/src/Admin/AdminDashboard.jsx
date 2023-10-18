import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import backgroundImage from '../assets/stats.png'; // Import the image

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

    fetchRecentBookings() {
        const recentBookings = [
            {
                id: 1,
                user: 'User A',
                date: '2023-10-15',
                venue: 'Basketball Court',
                status: 'Pending',
            },
            {
                id: 2,
                user: 'User B',
                date: '2023-10-14',
                venue: 'Top Court',
                status: 'Pending',
            },
        ];

        this.setState({ recentBookings });
    }

    fetchBookingHistory() {
        const bookingHistory = [
            {
                id: 101,
                user: 'User X',
                date: '2023-10-13',
                venue: 'Football Ground',
                status: 'Approved',
            },
            {
                id: 102,
                user: 'User Y',
                date: '2023-10-12',
                venue: 'Basketball Court',
                status: 'Approved',
            },
        ];

        this.setState({ bookingHistory });
    }

    handleFileUpload = (userData) => {
        const sampleUserData = [
            {
                Name: 'John Doe',
                Email: 'john@example.com',
                Role: 'Admin',
            },
            {
                Name: 'Jane Smith',
                Email: 'jane@example.com',
                Role: 'User',
            },
        ];

        this.setState({ userData: sampleUserData });
    }

    approveBooking = (id) => {
        alert(`Booking ID ${id} approved!`);
    }
    handleDenyBooking = (id) => {
        alert(`Booking ID ${id} denied!`);
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.leftSection}>
                        <h1 style={{ ...styles.heading, fontSize: '40px', color: '#333' }}>Welcome to Admin Dashboard!!</h1>
    
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
    
                        <p style={{ padding: '20px 0', fontSize: '18px' }}>Upload an Excel file containing user information (xlsx format).</p>
    
                        {this.state.userData.length > 0 && (
                            <div>
                                <h2>User Data from Excel</h2>
                                <table style={styles.table}>
                                    <thead style={styles.tableHeader}>
                                        <tr>
                                            <th style={styles.tableHeaderCell}>Name</th>
                                            <th style={styles.tableHeaderCell}>Email</th>
                                            <th style={styles.tableHeaderCell}>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.userData.map((user, index) => (
                                            <tr key={index}>
                                                <td style={styles.tableCell}>{user.Name}</td>
                                                <td style={styles.tableCell}>{user.Email}</td>
                                                <td style={styles.tableCell}>{user.Role}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div style={styles.rightSection}>
                        <img src={backgroundImage} alt="Background" style={styles.backgroundImage} />
                    </div>
                </div>
                <div style={styles.tableSection}>
                    <h2 style={{ ...styles.tableHeaderCell, marginLeft: '20px' }}>Recent Bookings Awaiting Approval</h2>
                    <table style={{...styles.table,width: '80%', margin: '0 auto',border: '1px solid #000'}}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.tableHeaderCell}>Booking ID</th>
                                <th style={styles.tableHeaderCell}>User</th>
                                <th style={styles.tableHeaderCell}>Venue</th>
                                <th style={styles.tableHeaderCell}>Date</th>
                                <th style={styles.tableHeaderCell}>Status</th>
                                <th style={styles.tableHeaderCell}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.recentBookings.map((booking, index) => (
                                <tr key={index}>
                                    <td style={styles.tableCell}>{booking.id}</td>
                                    <td style={styles.tableCell}>{booking.user}</td>
                                    <td style={styles.tableCell}>{booking.venue}</td>
                                    <td style={styles.tableCell}>{booking.date}</td>
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
    
                    <h2 style={{ ...styles.tableHeaderCell, marginLeft: '20px', }}>Booking History</h2>
                    <table style={{...styles.table,width: '80%', margin: '0 auto',border: '1px solid #000'}}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.tableHeaderCell}>Booking ID</th>
                                <th style={styles.tableHeaderCell}>User</th>
                                <th style={styles.tableHeaderCell}>Venue</th>
                                <th style={styles.tableHeaderCell}>Date</th>
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
