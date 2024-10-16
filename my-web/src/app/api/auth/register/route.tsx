import { UserRegistrationData } from "@/types/user";
import { hashPassword } from "@/utils/bcrypt";
import { signJWT } from "@/utils/jwt";
import { userExists } from "@/utils/prisma";
import { userRegistrationValidator } from "@/utils/validators/userValidator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: UserRegistrationData = await request.json();
    const [hasErrors, errors] = userRegistrationValidator(body);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const hashedPassword = await hashPassword(body.password);
    const exists = await userExists(body.email, prisma);
    if (exists) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        password: hashedPassword,
        name: body.name,
      },
    });

    const token = await signJWT({ userId: user.id });
    return NextResponse.json({ token }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Registration failed" }, { status: 400 });
  }
}
