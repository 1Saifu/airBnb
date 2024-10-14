import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./utils/jwt";

const UNSAFE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
const PROTECTED_ROUTES = ["/api/bookings/", "/api/bookings/[id]", "/api/properties/", "/api/properties/[id]"]; // Protect these routes

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  console.log("middleware called", url.pathname);

  if (
    UNSAFE_METHODS.includes(request.method) &&
    PROTECTED_ROUTES.some(route => url.pathname.startsWith(route))
  ) {
    try {
      console.log("Unsafe request detected");

      const Authorization = request.headers.get("Authorization");
      if (!Authorization) {
        throw new Error("No authorization header");
      }

      const token = Authorization.split(" ")[1] || null;
      if (!token) {
        throw new Error("No token");
      }

      console.log("Authorization -> token", token);
      const decryptedToken = await verifyJWT(token); // Verify the token

      // If verification fails
      if (!decryptedToken) {
        throw new Error("No token payload");
      }

      console.log("Authorization -> decrypted", decryptedToken);
      const headers = new Headers(request.headers);
      headers.set("userId", decryptedToken.userId); // Pass the userId from the token

      return NextResponse.next({
        headers,
      });
    } catch (error: any) {
      console.log("Error validating token: ", error.message);
      return NextResponse.json(
        {
          message: "Unauthenticated",
        },
        { status: 401 }
      );
    }
  }
  console.log("Safe request");
  return NextResponse.next();
}

// Configure paths for middleware
export const config = {
  matcher: [
    "/api/bookings",          // Protect the main bookings route
    "/api/bookings/[id]",     // Protect individual booking routes
    "/api/properties",        // Protect the main properties route
    "/api/properties/[id]",    // Protect individual property routes
  ],
};
