"use client"

import React, { useState, useEffect } from "react";
import LocalStorageKit from "@/utils/localStorageKit";
import DatePicker from "../ui/datePicker";
import './style/bookingForm.css'

const bookingForm: React.FC<{ propertyId: string; onClose: () => void; onBookingSuccess: () => void }> = ({ propertyId, onClose, onBookingSuccess }) => {

    const [checkinDate, setCheckinDate] = useState<Date>(new Date());    
    const [checkoutDate, setCheckoutDate] = useState<Date>(new Date());    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [pricePerNight, setPricePerNight] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [createdById, setCreatedById] = useState<string | null>(null); 
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        console.log("Fetched Property ID:", propertyId); 
        const fetchPropertyDetails = async () => {
            try {
                const response = await fetch(`/api/properties/${propertyId}`);
                if (!response.ok) throw new Error("Failed to fetch property details");
                const property = await response.json();
                setPricePerNight(property.pricePerNight);
                setCreatedById(property.createdById)
            } catch (error) {
                console.error("Error fetching property details:", error);
            }
        };
        fetchPropertyDetails();
    }, [propertyId]);

    const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
        setCheckinDate(range.startDate);
        setCheckoutDate(range.endDate);
        const calculatedTotalPrice = calculateTotalPrice(pricePerNight, range.startDate, range.endDate);
        setTotalPrice(calculatedTotalPrice);
    };

    const calculateTotalPrice = (pricePerNight: number, checkinDate: Date | null, checkoutDate: Date | null): number => {
        if (!checkinDate || !checkoutDate) return 0;
        const numNights = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24);
        return Math.max(numNights, 0) * pricePerNight;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");


        if (!checkinDate || !checkoutDate || !firstName || !lastName || !phone || !email) {
            setError("Please fill out all fields.");
            return;
        }

        const customerId = LocalStorageKit.get('@library/customerId');
        console.log("Retrieved customerId for booking:", customerId);

        const bookingData = {
            propertyId,
            checkinDate,
            checkoutDate,
            firstName,
            lastName,
            phone,
            email,
            createdById: createdById,
            customerId: customerId,
        };

        console.log("Booking Data:", bookingData);

        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Booking Error Response:", errorResponse);
                setError(errorResponse.message || "Booking failed.");
                return;
            }

            alert("Booking successful!"); 
            onBookingSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating booking:", error);
            setError("Error creating booking.");
        }
    };
    
    return (
        <div className="booking-form">
            <h3>Book This Property</h3>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
                <div className="flex flex-row items-center gap-1 p-4">
                <DatePicker
                    dateRange={{
                        startDate: checkinDate || new Date(),
                        endDate: checkoutDate || new Date(),
                        key: "selection"
                    }}
                    onChange={handleDateChange}
                />
                </div>
                </div>
                <label style={{ marginTop: '50px' }}>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <p>Total Price: ${totalPrice.toFixed(2)}</p>
                <button className="buttonForm" type="submit">Confirm Booking</button>
            </form>
        </div>
    );
};

export default bookingForm;