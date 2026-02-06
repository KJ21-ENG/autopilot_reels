import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();

    // Clear our custom auth and paid status cookies
    cookieStore.delete("autopilotreels_session");
    cookieStore.delete("autopilotreels_paid");

    return NextResponse.json({ success: true });
}
