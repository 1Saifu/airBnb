import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const properties = await prisma.property.findMany();
        return NextResponse.json(properties);
    } catch (error: any) {
        console.error("Error fetching properties:", error.message);
        return NextResponse.json({ message: "Error fetching properties" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const newProperty = await prisma.property.create({ data });
        return NextResponse.json(newProperty, { status: 201 });
    } catch (error: any) {
        console.error("Error creating property:", error.message);
        return NextResponse.json({ message: "Error creating property" }, { status: 500 });
    }
}
