import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/jwt"; 

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const url = new URL(request.url);    
    const id = url.pathname.split("/").pop();

    const token = request.headers.get("Authorization")?.split(" ")[1]; 
    if (!token) {
        return NextResponse.json({ message: "No authentication token found" }, { status: 401 });
    }

    try {
        const decodedToken = await verifyJWT(token);  
        if (!decodedToken) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        const customerId = decodedToken.userId; 
        const isAdmin = decodedToken.isAdmin; 

        console.log("Booking fetch params:", { id, customerId, isAdmin });

        if (isAdmin) {
            const booking = await prisma.booking.findUnique({
                where: { 
                    id: id,
                },
            });

            if (!booking) {
                return NextResponse.json({ message: "Booking not found" }, { status: 404 });
            }

            return NextResponse.json(booking);
        }

        const booking = await prisma.booking.findUnique({
            where: { 
                id: id,  
                customerId: customerId,
            },
        });

        return NextResponse.json(booking);
    } catch (error: any) {
        console.error("Error fetching booking:", error.message);
        return NextResponse.json({ message: "Error fetching booking" }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    const id = request.url.split("/").pop();
    try {
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }
        
        await prisma.booking.delete({ where: { id } });
        return NextResponse.json({ message: "Booking deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting booking:", error.message);
        return NextResponse.json({ message: "Error deleting booking" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const id = request.url.split("/").pop();
    console.log("Booking ID:", id);
        try {
        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            console.log("Booking not found for ID:", id);
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }

        const data = await request.json();
        console.log("Booking Data Received:", data); 

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                checkinDate: data.checkinDate,
                checkoutDate: data.checkoutDate,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                totalPrice: data.totalPrice,
            },
        });
        
        return NextResponse.json(updatedBooking);
    } catch (error: any) {
        console.error("Error updating booking:", error.message);
        return NextResponse.json({ message: "Error updating booking" }, { status: 500 });
    }
}
