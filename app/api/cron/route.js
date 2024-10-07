// api/cron/route.js
import checkExpiryDates from "@/lib/cron";

export async function GET(req, res) {
  try {
    console.log("Cron job route triggered"); // Check if route is being hit
    await checkExpiryDates(); // Your cron logic function
    return new Response('Cron job executed', { status: 200 });
  } catch (error) {
    console.log('Error in cron job route:', error);
    return new Response('Cron job execution failed', { status: 500 });
  }
}