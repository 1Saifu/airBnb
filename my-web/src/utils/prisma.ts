import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 


export async function userExists(email: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });
    return !!user;
}


export default prisma;
