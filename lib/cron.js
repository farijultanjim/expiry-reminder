import dbConnect from "@/lib/dbConnect";
import DomainList from "@/models/DomainList";
import EmailLog from "@/models/EmailLog";

import nodemailer from "nodemailer";
import dayjs from "dayjs";

async function checkExpiryDates() {
  await dbConnect();
  const today = dayjs();

  try {
    // Find domains or hosting where expiry is in 20 or 7 days and reminders haven't been sent yet
    const soonToExpireDomains = await DomainList.find({
      $or: [
        {
          domainExpiryDate: {
            $gte: today.toDate(),
            $lte: today.add(20, "day").toDate(),
          },
          reminderSent20Days: false,
        },
        {
          domainExpiryDate: {
            $gte: today.toDate(),
            $lte: today.add(7, "day").toDate(),
          },
          reminderSent7Days: false,
        },
        {
          hostingExpiryDate: {
            $gte: today.toDate(),
            $lte: today.add(20, "day").toDate(),
          },
          reminderSent20Days: false,
        },
        {
          hostingExpiryDate: {
            $gte: today.toDate(),
            $lte: today.add(7, "day").toDate(),
          },
          reminderSent7Days: false,
        },
      ],
    });

    if (soonToExpireDomains.length > 0) {
      const transporter = nodemailer.createTransport({
        host: "mail.rrad.ltd", // SMTP server
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Loop over the soon-to-expire domains and send reminders
      for (const domain of soonToExpireDomains) {
        const daysRemaining = dayjs(domain.domainExpiryDate).diff(today, "day");
        let reminderType = "";

        // Determine which reminder to send
        if (daysRemaining === 20 && !domain.reminderSent20Days) {
          reminderType = "20-day";
        } else if (daysRemaining === 7 && !domain.reminderSent7Days) {
          reminderType = "7-day";
        }

        if (reminderType) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: domain.email,
            subject: `Reminder: ${reminderType} Expiry approaching for ${domain.domainName}`,
            html: `
              <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                  <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; background-color: #f9f9f9;">
                    <h2 style="text-align: center; color: #EE2625;">Domain/Hosting Expiry Reminder</h2>
                    <p>Dear User,</p>
                    <p>We hope this message finds you well.</p>
                    <p>This is a friendly reminder that your domain and/or hosting services are approaching their expiry dates. Please review the details below:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                      <thead>
                        <tr style="background-color: #EE2625; color: #fff;">
                          <th style="padding: 10px; border: 1px solid #e0e0e0;">Service</th>
                          <th style="padding: 10px; border: 1px solid #e0e0e0;">Details</th>
                          <th style="padding: 10px; border: 1px solid #e0e0e0;">Expiry Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="padding: 10px; border: 1px solid #e0e0e0;">Domain</td>
                          <td style="padding: 10px; border: 1px solid #e0e0e0;">${domain.domainName}</td>
                          <td style="padding: 10px; border: 1px solid #e0e0e0;">${dayjs(domain.domainExpiryDate).format('MMMM D, YYYY')}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px; border: 1px solid #e0e0e0;">Hosting</td>
                          <td style="padding: 10px; border: 1px solid #e0e0e0;">${domain.domainName} Hosting</td>
                          <td style="padding: 10px; border: 1px solid #e0e0e0;">${dayjs(domain.hostingExpiryDate).format('MMMM D, YYYY')}</td>
                        </tr>
                      </tbody>
                    </table>

                    <p style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">
                      Please ensure to renew your domain and/or hosting services before the expiry dates to avoid any service interruptions. 
                      If you have any questions or need assistance, contact us at 
                      <a href="mailto:info@rrad.ltd" style="color: #EE2625; text-decoration: none;">info@rrad.ltd</a>.
                    </p>
                    
                    <p>Thank you for your attention to this matter.</p>
                    <p>Best regards,</p>
                    <p><strong>Your Support Team</strong></p>
                    <p><small style="color: #888;">This is an automated email. Please do not reply to this message.</small></p>
                  </div>
                </body>
              </html>
            `
          };

          try {
            await transporter.sendMail(mailOptions);

            // Log the sent email
            await EmailLog.create({
              recipient: domain.email,
              subject: mailOptions.subject,
              content: mailOptions.html,
              emailType: 'expiry_reminder',
            });

            // Update the reminder status in the database to prevent duplicate emails
            if (reminderType === "20-day") {
              domain.reminderSent20Days = true;
            } else if (reminderType === "7-day") {
              domain.reminderSent7Days = true;
            }

            await domain.save(); // Save the updated reminder status
          } catch (error) {
            console.error(`Failed to send email to ${domain.email}:`, error);
          }
        }
      }
    } else {
      console.log("No domains/hosting expiring within the specified periods.");
    }
  } catch (error) {
    console.error("Error during cron job:", error);
  }
}

// Call the function immediately for testing purposes
checkExpiryDates();

export default checkExpiryDates;
