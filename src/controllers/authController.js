import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  // const existingUser = await User.exists({ email }); faster(no full Object)

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    //409 better
    return next(createHttpError(400, 'User with such email already exists'));
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ email, password: hashedPassword });
  const newSession = await createSession(newUser._id);
  setSessionCookies(newSession, res);
  return res.status(201).json(newUser);
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(401, 'Invalid email or password'));
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return next(createHttpError(401, 'Invalid email or password'));
  }
  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(newSession, res);

  return res.status(200).json(user);
};

export const refreshSession = async (req, res, next) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  const userId = session.userId;

  const isRefreshTokenExpired = new Date() > session.refreshTokenValidUntil;
  if (isRefreshTokenExpired) {
    return next(createHttpError(401, 'Refresh token expired'));
  }

  await Session.deleteOne({ _id: sessionId, refreshToken });
  const newSession = await createSession(userId);
  setSessionCookies(newSession, res);
  return res.status(200).json({ message: 'Session refreshed' });
};

export const logout = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  return res.status(204).end();
};

export const requestResetEmail = async (req, res, next) => {
  const email = req.body?.email;
  if (!email) return next(createHttpError(400, 'Email is required'));

  const user = await User.findOne({ email });
  const NEUTRAL = { message: 'Password reset email sent successfully' };
  if (!user) return res.status(200).json(NEUTRAL);

  const token = jwt.sign(
    { sub: String(user._id), email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  try {
    const templatePath = path.resolve(
      'src/templates/reset-password-email.html',
    );
    const source = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(source);
    const html = template({
      name: user.username || user.email,
      link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`,
    });

    await sendMail({ to: email, subject: 'Reset your password', html });
  } catch {
    return next(
      createHttpError(500, 'Failed to send the email, please try again later.'),
    );
  }

  return res.status(200).json(NEUTRAL);
};

export const requestResetPass = async (req, res, next) => {
  const { resetToken, password } = req.body;
  let payload;
  try {
    payload = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch (error) {
    return next(createHttpError(401, 'Invalid or expired token'));
  }
  const user = await User.findOne({ email: payload.email, _id: payload.id });
  if (!user) {
    return next(createHttpError(404, 'User not found'));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });
  await Session.deleteMany({ userId: user._id });
  return res.status(200).json({ message: 'Password has been update' });
};
