import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
    
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Unauthorized: no user ID' });
    }

    req.user = decoded; // contains { id, role }
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
