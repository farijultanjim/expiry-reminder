import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { hashPassword } from '@/utils/hash';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json(); // Get the request body

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), {
        status: 400,
      });
    }

    await dbConnect(); // Connect to the DB

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: 'User registered successfully', success: true }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error registering user:", error); // Log the error
    return new Response(JSON.stringify({ message: 'Error registering user', error: error.message }), {
      status: 500,
    });
  }
}
