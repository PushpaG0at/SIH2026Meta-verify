import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'metra_verify_secret_jwt_key_sih_2026_dev';

export async function authenticate(req, res, next) {
  try {
    // 1. Check for Demo Role simulation header (for hackathon jury demo switching)
    const demoRole = req.headers['x-demo-role'];
    if (demoRole && !req.headers.authorization) {
      const demoUser = await prisma.user.findFirst({
        where: { role: demoRole.toUpperCase() }
      });
      if (demoUser) {
        req.user = demoUser;
        return next();
      }
    }

    // 2. Standard Bearer JWT verification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ error: 'User associated with token not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] roles. Your role is '${req.user.role}'.`
      });
    }

    next();
  };
}
