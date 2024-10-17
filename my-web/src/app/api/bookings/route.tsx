import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
        const { propertyId, checkinDate, checkoutDate, customer } = await request.json();
        const property = await prisma.property.findUnique({ where: { id: propertyId } });
        if (!property) {
            return NextResponse.json({ message: "Property not found" }, { status: 404 });
        }

        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        const numberOfNights = (checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24);

        if (numberOfNights <= 0) {
            return NextResponse.json({ message: "Invalid check-in and check-out dates" }, { status: 400 });
        }

        const totalPrice = numberOfNights * property.pricePerNight;

        const newBooking = await prisma.booking.create({
            data: {
                checkinDate: checkin,
                checkoutDate: checkout,
                totalPrice,
                customer,
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
