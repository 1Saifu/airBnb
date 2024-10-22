// import { NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json({ message: "Test route is working!" });
// }

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ message: "Test POST successful", data: body }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to process POST request" }, { status: 500 });
  }
}

