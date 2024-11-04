import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PropertyCreateData } from "../../../types/property"; 
import { validatePropertyCreateData } from "../../../utils/validators/propertyValidator"; 

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
        const data: PropertyCreateData = await request.json();
        validatePropertyCreateData(data); 
        
        const createdById = data.createdById; 
        if (!createdById) {
            throw new Error("User ID is required to create a property.");
        }
        
        const newProperty = await prisma.property.create({
            data: {
                ...data,
                createdById: createdById, 
            }
        });
        return NextResponse.json(newProperty, { status: 201 });
    } catch (error: any) {
        console.error("Error creating property:", error.message);
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

