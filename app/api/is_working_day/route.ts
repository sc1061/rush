import { isWorkingDay } from "@/calendars/calendars";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    let targetDate = request.nextUrl.searchParams.get('date')
    let date = targetDate ? new Date(targetDate) : new Date()
    let is_working_day = isWorkingDay(date)


    return NextResponse.json({is_working_day})
}