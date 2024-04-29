import { cacheCalendars, getCurrentCache, isCalendarsCache } from "@/calendars/calendars";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET() {
    await cacheCalendars()
    return NextResponse.json({done: isCalendarsCache(), ...getCurrentCache()})
}