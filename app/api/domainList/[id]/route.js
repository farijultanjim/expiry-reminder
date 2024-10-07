// app/api/domainList/[id]/route.js

import dbConnect from "@/lib/dbConnect";
import DomainList from "@/models/DomainList";
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

    const domainList = await DomainList.findOne({ _id: id, user: userId });

    if (!domainList) {
      return NextResponse.json({ success: false, message: "Domain not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, domainList });
  } catch (error) {
    console.error("Error fetching domain details:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
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
      const body = await req.json();
  
      // Find the old domain data
      const oldDomain = await DomainList.findOne({ _id: id, user: userId });
      if (!oldDomain) {
        return NextResponse.json({ success: false, message: "Domain not found" }, { status: 404 });
      }
  
      // Update the domain
      const updatedDomainList = await DomainList.findOneAndUpdate(
        { _id: id, user: userId },
        body,
        { new: true, runValidators: true }
      );
  
      // Calculate changes
      const changes = {};
      for (const [key, value] of Object.entries(body)) {
        if (oldDomain[key]?.toString() !== value?.toString()) {
          changes[key] = {
            from: oldDomain[key],
            to: value,
          };
        }
      }
  
      // Save history if there are changes
      if (Object.keys(changes).length > 0) {
        await DomainHistory.create({
          domainId: id,
          user: userId,
          changes,
        });
      }
  
      return NextResponse.json({ success: true, message: "Domain updated successfully", data: updatedDomainList });
    } catch (error) {
      console.error("Error updating domain details:", error);
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
  }