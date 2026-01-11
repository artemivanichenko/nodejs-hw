import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      require: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre('save', function () {
  if (!this.username) {
    this.username = this.email;
  }
});

userSchema.methods.toJSON = function () {
  const copiedObj = this.toObject();
  delete copiedObj.password;
  return copiedObj;
};

export const User = model('User', userSchema);
