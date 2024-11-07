import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PropertyUpdateData } from "../../../../types/property"; 
import { validatePropertyUpdateData } from "../../../../utils/validators/propertyValidator"; 

const prisma = new PrismaClient();

async function getIdFromRequest(request: NextRequest) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    return id;
}

export async function GET(request: NextRequest) {
    const id = await getIdFromRequest(request);
    if (!id) {
        return NextResponse.json({ message: "Property ID is required" }, { status: 400 });
    }

    try {
        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) {
            return NextResponse.json({ message: "Property not found" }, { status: 404 });
        }
        return NextResponse.json(property);
    } catch (error: any) {
        console.error("Error fetching property:", error.message);
        return NextResponse.json({ message: "Error fetching property" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const id = await getIdFromRequest(request);
    if (!id) {
        return NextResponse.json({ message: "Property ID is required" }, { status: 400 });
    }

    try {

        await prisma.booking.deleteMany({
            where: { propertyId: id },
        });

        await prisma.property.delete({ 
            where: { id } 
        });

        return NextResponse.json({ message: "Property deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting property:", error.message);
        return NextResponse.json({ message: "Error deleting property" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const id = await getIdFromRequest(request);
    if (!id) {
        return NextResponse.json({ message: "Property ID is required" }, { status: 400 });
    }

    try {
        const data: PropertyUpdateData = await request.json();
        console.log("Received data for update:", data);
        validatePropertyUpdateData(data); 
        
        const updatedProperty = await prisma.property.update({
            where: { id },
            data
        });
        
        return NextResponse.json(updatedProperty);
    } catch (error: any) {
        console.error("Error updating property:", error.message);
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
