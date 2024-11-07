"use client"

import React, { useState, useEffect } from "react";
import LocalStorageKit from "@/utils/localStorageKit";
import './style/bookingCard.css'


const bookingCard: React.FC<{ onEdit: () => void; bookingId: string; onBookingSuccess: () => void;  isAdmin: boolean;  }> = ({ bookingId, onBookingSuccess, isAdmin, onEdit }) => {

    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);  


    useEffect(() => {
        
        const fetchBookingDetails = async () => {
            try {

                const token = LocalStorageKit.get('@library/token');

                if (!token) {
                    console.error("No authentication token found");
                    setError("You need to be logged in or register to book.");
                }

                const response = await fetch(`/api/bookings/${bookingId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });


                if (!response.ok) {
                    setBookingDetails(null); 
                    return;
                }

                const data = await response.json();
                setBookingDetails(data);
            } catch (error) {
                console.error("Error fetching booking:", error);
                setError("Failed to fetch booking details.");
            }
        };

        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);
    
    const toggleDetails = () => {
        setIsOpen(!isOpen);
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this booking?");
        if (confirmed) {

            const customerId = LocalStorageKit.get("@library/customerId");

            console.log("isAdmin:", isAdmin);
            console.log("customerId:", customerId);

            if (isAdmin || customerId === customerId) { 
                try {
                    const token = LocalStorageKit.get('@library/token');
                    const response = await fetch(`/api/bookings/${bookingId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        alert("Booking successfully deleted!");
                        setIsOpen(false);
                        onBookingSuccess();
                        window.location.reload();
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (error) {
                    console.error("Error deleting booking:", error);
                    setError("Failed to delete booking.");
                }
            } else {
                alert("You are not authorized to delete this booking.");
            }
        }
    };

    if (error) {
        return (
            <div className="error-message">
                <p style={{ marginLeft: '15px' }}>{error}</p>
            </div>
        );
    }

    if (!bookingDetails) {
        return null;    }

        return (
            <>
                <div className={`booking-card ${isOpen ? 'open' : ''}`} onClick={toggleDetails}>
                    <h3>Booking Details</h3>
                    <p>{bookingDetails.firstName} {bookingDetails.lastName}</p>
                    <p>Email: {bookingDetails.email}</p>
                    {isOpen && (
                        <div className="extra-details">
                            <p>Check-in Date: {new Date(bookingDetails.checkinDate).toLocaleDateString()}</p>
                            <p>Check-out Date: {new Date(bookingDetails.checkoutDate).toLocaleDateString()}</p>
                            <p>Total Price: ${bookingDetails.totalPrice}</p>
                        </div>
                    )}
                    <button className="view-details-btn">{isOpen ? "Hide Details" : "View Details"}</button>
                   
                </div>
    
                {isOpen && (
                    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Full Booking Details</h3>
                            <p>First Name: {bookingDetails.firstName}</p>
                            <p>Last Name: {bookingDetails.lastName}</p>
                            <p>Email: {bookingDetails.email}</p>
                            <p>Phone: {bookingDetails.phone}</p>
                            <p>Check-in Date: {new Date(bookingDetails.checkinDate).toLocaleDateString()}</p>
                            <p>Check-out Date: {new Date(bookingDetails.checkoutDate).toLocaleDateString()}</p>
                            <p>Total Price: ${bookingDetails.totalPrice}</p>
                            <button className="view-details-btn" onClick={() => setIsOpen(false)}>Close</button>
                            
                            <button onClick={onEdit} className="edit-booking-btn">Edit</button>
                            <button className="delete-booking-btn" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                )}
            </>
        );
}

export default bookingCard;