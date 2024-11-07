"use client"

import React, { useState, useEffect } from "react";
import BookingCard from "../../components/booking/bookingCard"
import LocalStorageKit from "@/utils/localStorageKit";
import Navbar from '../../components/layout/Navbar';
import BookingEdit from "../../components/booking/BookingEdit";


const bookingsPage: React.FC = () => {
    
    const [userBookings, setUserBookings] = useState<any[]>([]);
    const [error, setError] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                const customerId = LocalStorageKit.get("@library/customerId"); 
                if (!customerId) {
                    setError("No user found, please log in.");
                    return;
                }

                const response = await fetch(`/api/bookings?customerId=${customerId}`);
                if (!response.ok) throw new Error("Failed to fetch bookings");
                const bookings = await response.json();
                
                setUserBookings(bookings);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError("Failed to load bookings.");
            }
        };
        
        fetchUserBookings();
    }, []);

    const handleEditBooking = (booking: any) => {
        setSelectedBooking(booking);
        setIsEditing(true);  
    };

    const closeEditModal = () => {
        setSelectedBooking(null); 
        setIsEditing(false);  
    };

    if (error) {
        return <p className="error-message">{error}</p>;
    }
    
    return (
        <div className="booking-page">
            <Navbar />
            <h2 style={{ fontWeight: 'bolder', margin: '10px', marginLeft: '20px', fontSize: '30px', color: '#1A364C' }}>Your Bookings</h2>
            {userBookings.length > 0 ? (
                <div className="booking-cards">
                    {userBookings.map((booking) => (
                        <BookingCard 
                            key={booking.id} 
                            bookingId={booking.id}
                            onBookingSuccess={() => {}}
                            isAdmin={booking.isAdmin || false}
                            onEdit={() => handleEditBooking(booking)} 
                        />
                    ))}
                </div>
            ) : (
                <p>No bookings made yet.</p>
            )}

            {isEditing && selectedBooking && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <BookingEdit
                            propertyId={selectedBooking.propertyId} 
                            bookingDetails={selectedBooking}
                            onClose={closeEditModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default bookingsPage;