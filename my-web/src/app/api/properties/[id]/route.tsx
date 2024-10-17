import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const id = request.url.split("/").pop();
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
    const id = request.url.split("/").pop();
    try {
        await prisma.property.delete({ where: { id } });
        return NextResponse.json({ message: "Property deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting property:", error.message);
        return NextResponse.json({ message: "Error deleting property" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const id = request.url.split("/").pop();
    try {
        const data = await request.json();
        const updatedProperty = await prisma.property.update({ where: { id }, data });
        return NextResponse.json(updatedProperty);
    } catch (error: any) {
        console.error("Error updating property:", error.message);
        return NextResponse.json({ message: "Error updating property" }, { status: 500 });
    }
}
