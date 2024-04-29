import { cacheCalendars, isCalendarsCache } from "@/calendars/calendars";
import { NextResponse } from "next/server";

export async function GET() {
    await cacheCalendars()
    return NextResponse.json({done: isCalendarsCache()})
}