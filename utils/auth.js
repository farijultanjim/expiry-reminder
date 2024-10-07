// // utils/auth.js
// import jwt from 'jsonwebtoken';

// // Middleware to protect API routes
// export const verifyToken = (handler) => {
//   return async (req, res) => {
//     const { authorization } = req.headers;

//     if (!authorization) {
//       return res.status(401).json({ message: 'Authorization token required' });
//     }

//     try {
//       // Get the token from the Authorization header
//       const token = authorization.split(' ')[1];
      
//       // Verify the token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Add the decoded user data to the request object
//       req.user = decoded;

//       return handler(req, res);
//     } catch (error) {
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }
//   };
// };
