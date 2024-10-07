// app/api/domainList/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import DomainList from "@/models/DomainList";
import jwt from "jsonwebtoken";
import * as Yup from 'yup';

// Connect to database
dbConnect();

// Authentication middleware
const authenticate = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Input validation schema
const domainSchema = Yup.object().shape({
  domainName: Yup.string().required(),
  companyName: Yup.string().required(),
  email: Yup.string().email().required(),
  phone: Yup.string(),
  domainPurchaseDate: Yup.date(),
  domainExpiryDate: Yup.date(),
  domainSellingPrice: Yup.number(),
  domainBuyingPrice: Yup.number(),
  domainSellingCurrency: Yup.string(),
  domainBuyingCurrency: Yup.string(),
  hostingUnit: Yup.string(),
  hostingPrice: Yup.number(),
  hostingCurrency: Yup.string(),
  hostingPurchaseDate: Yup.date(),
  hostingExpiryDate: Yup.date(),
  hostingCompany: Yup.string(),
  note: Yup.string(),
});

// Error handler
const handleError = (error) => {
  console.error("Server error:", error);
  return NextResponse.json(
    { success: false, message: "An unexpected error occurred" },
    { status: 500 }
  );
};

// GET method to fetch domain lists
export async function GET() {
  try {
    const userId = await authenticate();
    const domainLists = await DomainList.find({ user: userId });
    return NextResponse.json({ success: true, domainLists });
  } catch (error) {
    if (error.message === "Not authenticated" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    return handleError(error);
  }
}

// POST method to create a new domain list
export async function POST(req) {
  try {
    const userId = await authenticate();
    const body = await req.json();

    await domainSchema.validate(body);

    const newDomainList = new DomainList({
      user: userId,
      ...body
    });

    await newDomainList.save();

    return NextResponse.json(
      { success: true, message: "Domain list created successfully", data: newDomainList },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    if (error.message === "Not authenticated" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    return handleError(error);
  }
}

// DELETE method to remove a domain list
export async function DELETE(req) {
  try {
    const userId = await authenticate();
    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get('id');

    if (!domainId) {
      return NextResponse.json(
        { success: false, message: "Domain ID is required" },
        { status: 400 }
      );
    }

    const domain = await DomainList.findOneAndDelete({ _id: domainId, user: userId });

    if (!domain) {
      return NextResponse.json(
        { success: false, message: "Domain not found or you do not have permission" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Domain list deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error.message === "Not authenticated" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    return handleError(error);
  }
}

// PATCH method to archive or unarchive a domain list
export async function PATCH(req) {
  try {
    const userId = await authenticate();
    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get('id');

    if (!domainId) {
      return NextResponse.json(
        { success: false, message: "Domain ID is required" },
        { status: 400 }
      );
    }

    const { isArchived } = await req.json();

    const updatedDomain = await DomainList.findOneAndUpdate(
      { _id: domainId, user: userId },
      { $set: { isArchived } },
      { new: true, runValidators: true }
    );

    if (!updatedDomain) {
      return NextResponse.json(
        { success: false, message: "Domain not found or you do not have permission" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Domain list ${isArchived ? 'archived' : 'unarchived'} successfully`,
      data: updatedDomain
    }, { status: 200 });
  } catch (error) {
    if (error.message === "Not authenticated" || error.message === "Invalid token") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    return handleError(error);
  }
}