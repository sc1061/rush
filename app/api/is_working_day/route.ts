import { isWorkingDay } from "@/calendars/calendars";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    let is_working_day = isWorkingDay(new Date())


    return NextResponse.json({is_working_day})
}