import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'metra_verify_secret_jwt_key_sih_2026_dev';

export async function register(req, res) {
  try {
    const { email, password, name, role = 'BUSINESS', phone, orgName, licenseNo } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Full name, email address, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone ? phone.trim() : null;

    if (cleanName.length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must meet the required security rules (minimum 6 characters).' });
    }

    const ALLOWED_ROLES = ['BUSINESS', 'INSPECTOR', 'OFFICER'];
    const normalizedRole = (role || 'BUSINESS').toUpperCase();

    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ error: 'Invalid role. Allowed roles are: BUSINESS, INSPECTOR, OFFICER' });
    }

    const existingUser = await prisma.user.findFirst({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in instead.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        name: cleanName,
        role: normalizedRole,
        phone: cleanPhone,
        orgName: orgName?.trim() || null,
        licenseNo: licenseNo?.trim() || null
      }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        orgName: user.orgName
      },
      token
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in instead.' });
    }
    console.error('Registration server error:', error.message);
    res.status(500).json({ error: 'Something went wrong while creating your account.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findFirst({ where: { email: cleanEmail } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        orgName: user.orgName,
        licenseNo: user.licenseNo
      },
      token
    });
  } catch (error) {
    console.error('Login server error:', error.message);
    res.status(500).json({ error: 'Something went wrong during authentication.' });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        orgName: true,
        licenseNo: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}

export async function getDemoAccounts(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        orgName: true,
        licenseNo: true
      }
    });

    // Group by role so frontend can offer quick 1-click test logins
    const rolesMap = {};
    for (const u of users) {
      if (!rolesMap[u.role]) {
        const token = jwt.sign({ userId: u.id, role: u.role }, JWT_SECRET, { expiresIn: '7d' });
        rolesMap[u.role] = { ...u, token };
      }
    }

    res.json({ accounts: rolesMap });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve demo accounts' });
  }
}

export async function logout(req, res) {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log out' });
  }
}

