import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    accessToken: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    accessTokenValidUntil: {
      type: Date,
      require: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Session = model('Session', sessionSchema);
