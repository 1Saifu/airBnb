import * as Jose from 'jose';

type JWTUserPayload = {
    userId: string;
    [key: string]: any;
}


const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
}


const encodedSecret = new TextEncoder().encode(secret);

export async function signJWT(payload: JWTUserPayload): Promise<string> {
    return await new Jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1w')
        .sign(encodedSecret);
}

export async function verifyJWT(token: string): Promise<JWTUserPayload | null> {
    try {
        const { payload } = await Jose.jwtVerify(token, encodedSecret);
        return payload as JWTUserPayload;
    } catch (e) {
        return null;
    }
}
