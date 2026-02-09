import createHttpError from 'http-errors';
import { saveToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(createHttpError(400, 'No file uploaded'));
  }
  console.log(req.file);
  const result = await saveToCloudinary(req.file.buffer);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true },
  );
  return res.status(200).json({ url: user.avatar });
};
