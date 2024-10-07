// app/api/domainList/[id]/route.js
import dbConnect from "@/lib/dbConnect";
import DomainList from "@/models/DomainList";
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

    const domainDetails = await DomainList.findOne({ _id: id, user: userId });
    if (!domainDetails) {
      return NextResponse.json({ success: false, message: "Domain not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: domainDetails });
  } catch (error) {
    console.error("Error fetching domain details:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
