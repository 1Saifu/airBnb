import { NextRequest, NextResponse } from "next/server";
import { UserRegistrationData } from "@/types/user";
import { hashPassword } from "@/utils/bcrypt";
import { signJWT } from "@/utils/jwt";
import { userExists } from "@/utils/prisma"; 
import { userRegistrationValidator } from "../../../../utils/validators/userValidator";
import prisma from "@/utils/prisma"; 
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body: UserRegistrationData = await request.json();
    console.log("Request Body:", body);

    const [hasErrors, errors] = userRegistrationValidator(body);
    if (hasErrors) {
      console.log("Validation Errors:", errors);
      return NextResponse.json({ errors }, { status: 400 });
    }

    const hashedPassword = await hashPassword(body.password);
    console.log("Hashed Password:", hashedPassword);

    const exists = await userExists(body.email); 
    if (exists) {
      console.log("User with this email already exists");
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    console.log("Data before user creation:", {
      email: body.email.toLowerCase(),
      password: hashedPassword,
      name: body.name,
      isAdmin: body.isAdmin ?? false,
    });

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        password: hashedPassword,
        name: body.name,
        isAdmin: body.isAdmin ?? false,
        passwordResetUUID: uuidv4(),
      },
    });
    
    console.log("User Created:", user);

    const token = await signJWT({ userId: user.id, isAdmin: user.isAdmin });

     return NextResponse.json({ token, userId: user.id, customerId: user.id, isAdmin: user.isAdmin,  }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Registration failed", error: error.message }, { status: 400 });
  }
}
