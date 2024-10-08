import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Domain Expiration Reminder",
  description:
    "Domain Expiration Reminder app to update user about there domain subscription",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
