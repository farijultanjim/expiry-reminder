
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import EmailLog from "@/models/EmailLog";

export async function POST(request) {
  await dbConnect();

  try {
    const { email, renewalPeriod, newExpiryDate } = await request.json();

    if (!email || !renewalPeriod || !newExpiryDate) {
      return NextResponse.json({ success: false, message: "Email, renewal period, and new expiry date are required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "mail.rrad.ltd",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Domain Renewal Confirmation",
      text: `Congratulations, your domain has been renewed for ${renewalPeriod} year(s). Your new domain expiry date is ${new Date(newExpiryDate).toLocaleDateString()}. Thank you for your continued trust in our services.`,
    };

    // Log the sent email
    await EmailLog.create({
      recipient: email,
      subject: mailOptions.subject,
      content: mailOptions.text,
      emailType: 'renewal',
    });

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent", info }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, message: "Failed to send email", error }, { status: 500 });
  }
}