// /api/getEmailLogs/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import EmailLog from "@/models/EmailLog";

export async function GET(request) {
  await dbConnect();

  try {
    const emailLogs = await EmailLog.find().sort({ sentAt: -1 }).limit(100); // Get the last 100 emails
    return NextResponse.json({ success: true, data: emailLogs }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving email logs:", error);
    return NextResponse.json({ success: false, message: "Failed to retrieve email logs", error }, { status: 500 });
  }
}