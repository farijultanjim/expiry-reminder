
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

dbConnect();

export async function POST(req) {
  try {

    const reqBody = await req.json()
    const { email, password } = reqBody;
    console.log(reqBody);

    //check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 })
    }

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password)

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

    //create token data
    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email
    }

    //create token
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" })

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    
    return response;
    

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}