"use client"

import React, { useState, useEffect } from "react";
import LocalStorageKit from "@/utils/localStorageKit";
import DatePicker from "../ui/datePicker";
import './style/bookingEdit.css'

const bookingEdit: React.FC<{ propertyId: string;  bookingDetails: any; onClose: () => void; }> = ({ propertyId ,bookingDetails, onClose }) => {
    const [checkinDate, setCheckinDate] = useState<Date | null>(null);
    const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [pricePerNight, setPricePerNight] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [error, setError] = useState("");
    const [createdById, setCreatedById] = useState<string | null>(null);


    useEffect(() => {
        const fetchPropertyDetails = async () => {
            if (!propertyId) {
                return;
              }
            try {
                const response = await fetch(`/api/properties/${propertyId}`);
                if (!response.ok) throw new Error("Failed to fetch property details");
                const property = await response.json();
                setPricePerNight(property.pricePerNight);
                setCreatedById(property.createdById);
                console.log("Fetched Property Details:", property);

            } catch (error) {
                console.error("Error fetching property details:", error);
            }
        };
        fetchPropertyDetails();
    }, [propertyId]);

    useEffect(() => {
        if (bookingDetails) {
            const checkin = new Date(bookingDetails.checkinDate);
            const checkout = new Date(bookingDetails.checkoutDate);
            setCheckinDate(checkin);
            setCheckoutDate(checkout);
            setFirstName(bookingDetails.firstName);
            setLastName(bookingDetails.lastName);
            setPhone(bookingDetails.phone);
            setEmail(bookingDetails.email);
        }
    }, [bookingDetails]);


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


        const bookingData = {
            bookingId: bookingDetails.id,  
            checkinDate,
            checkoutDate,
            firstName,
            lastName,
            phone,
            email,
            totalPrice,
        };


        try {
            const response = await fetch(`/api/bookings/${bookingDetails.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Error Response:", errorResponse);
                setError(errorResponse.message || "Booking update failed.");
                return;
            }

            alert("Booking updated successfully!");
            window.location.reload();
            onClose();
        } catch (error) {
            console.error("Error updating booking:", error);
            setError("Error updating booking.");
        }
    };
return (
    <div className="booking-form2">
    <h3>Edit Booking</h3>
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
        <button className="buttonForm2" type="submit">Save Changes</button>
    </form>
</div>
);
}

export default bookingEdit;