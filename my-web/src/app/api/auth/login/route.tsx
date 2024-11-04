import { UserLoginData } from "@/types/user";
import { comparePassword } from "@/utils/bcrypt";
import { signJWT } from "@/utils/jwt";
import { userLoginValidator } from "@/utils/validators/userValidator";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body: UserLoginData = await request.json();
    const [hasErrors, errors] = userLoginValidator(body);
    if (hasErrors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: body.email.toLowerCase(),
      },
    });

    const passwordIsSame = await comparePassword(body.password, user.password);
    if (!passwordIsSame) {
      return NextResponse.json({ message: "Password mismatch" }, { status: 400 });
    }

    const token = await signJWT({ userId: user.id, isAdmin: user.isAdmin });

    return NextResponse.json({ token, userId: user.id, isAdmin: user.isAdmin }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "User matching credentials not found" }, { status: 404 });
  }
}
