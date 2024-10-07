// import nodemailer from "nodemailer";

// // Function to send reminder email
// const sendReminderEmail = async (to, type, domainName, expiryDate) => {
//   // Set up the email transporter using your SMTP or email service
//   const transporter = nodemailer.createTransport({
//     host: "mail.rrad.ltd",
//     port: 465,
//     secure: true, // true for port 465, false for other ports
//     auth: {
//       user: "domain-notification@rrad.ltd",
//       pass: "AO#&a?Kf&MJT",
//     },
//   });

//   // Create the email options (recipient, subject, message)
//   const mailOptions = {
//     from: process.env.EMAIL_USER, // Sender address
//     to, // Recipient (email from the DomainList record)
//     subject: `${type} Reminder: ${domainName}`, // Subject line (Domain/Hosting Expiry)
//     text: `Hi there,

// This is a friendly reminder that your ${type.toLowerCase()} for the domain "${domainName}" will expire on ${expiryDate.toLocaleDateString()}.

// Please renew your services to avoid interruption.

// Thank you!`,
//   };

//   // Send the email
//   await transporter.sendMail(mailOptions);
// };

// export default sendReminderEmail;
