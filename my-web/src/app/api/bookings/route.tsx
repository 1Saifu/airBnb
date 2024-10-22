import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateBookingData } from "../../../utils/validators/bookingValidator";
import { BookingData } from "../../../types/booking";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const bookings = await prisma.booking.findMany();
        return NextResponse.json(bookings);
    } catch (error: any) {
        console.error("Error fetching bookings:", error.message);
        return NextResponse.json({ message: "Error fetching bookings" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data: BookingData = await request.json();

        const [hasErrors, errors] = validateBookingData(data);
        if (hasErrors) {
            return NextResponse.json(errors, { status: 400 });
        }

        const { propertyId, checkinDate, checkoutDate, customer } = data;
        const property = await prisma.property.findUnique({ where: { id: propertyId } });
        if (!property) {
            return NextResponse.json({ message: "Property not found" }, { status: 404 });
        }

        const totalPrice = (new Date(checkoutDate).getTime() - new Date(checkinDate).getTime()) / (1000 * 3600 * 24) * property.pricePerNight;

        const newBooking = await prisma.booking.create({
            data: {
                checkinDate: new Date(checkinDate),
                checkoutDate: new Date(checkoutDate),
                totalPrice,
                customerId: customer.id, 
                propertyId,
                createdById: customer.createdById, 
            },
        });

        return NextResponse.json(newBooking, { status: 201 });
    } catch (error: any) {
        console.error("Error creating booking:", error.message);
        return NextResponse.json({ message: "Error creating booking" }, { status: 500 });
    }
}
