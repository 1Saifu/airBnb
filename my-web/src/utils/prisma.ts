import { PrismaClient } from "@prisma/client";

// This checks if a user exists in the database
export async function userExists(email: string, client: PrismaClient): Promise<boolean> {
    const user = await client.user.findFirst({
        where: {
            email: email
        }
    })
    return !!user
}