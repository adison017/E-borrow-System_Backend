import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  console.log('Auth middleware - URL:', req.url);
  console.log('Auth middleware - Headers:', req.headers);

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');

  if (!token) {
    console.log('Auth middleware - No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      console.log('Auth middleware - Invalid token:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Auth middleware - Valid token for user:', user);
    req.user = user;
    next();
  });
};

export default authMiddleware;