import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Only log authentication for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth middleware - URL:', req.url);
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      // Log invalid token errors only in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth middleware - Invalid token:', err.message);
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    // Log valid token info only in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Auth OK - user: ${user.username}, role: ${user.role}`);
    }
    
    req.user = user;
    next();
  });
};

export default authMiddleware;