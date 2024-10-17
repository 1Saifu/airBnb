import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const id = request.url.split("/").pop();
    try {
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }
        return NextResponse.json(booking);
    } catch (error: any) {
        console.error("Error fetching booking:", error.message);
        return NextResponse.json({ message: "Error fetching booking" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const id = request.url.split("/").pop();
    try {
        await prisma.booking.delete({ where: { id } });
        return NextResponse.json({ message: "Booking deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting booking:", error.message);
        return NextResponse.json({ message: "Error deleting booking" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const id = request.url.split("/").pop();
    try {
        const data = await request.json();
        const updatedBooking = await prisma.booking.update({ where: { id }, data });
        return NextResponse.json(updatedBooking);
    } catch (error: any) {
        console.error("Error updating booking:", error.message);
        return NextResponse.json({ message: "Error updating booking" }, { status: 500 });
    }
}
