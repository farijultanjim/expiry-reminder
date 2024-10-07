// app/api/domainList/[id]/history/route.js
import dbConnect from "@/lib/dbConnect";
import DomainHistory from "@/models/DomainHistory";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const token = req.headers.get("cookie")?.split("=")[1];
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const history = await DomainHistory.find({ domainId: id, user: userId }).sort({ changedAt: -1 });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching domain history:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}