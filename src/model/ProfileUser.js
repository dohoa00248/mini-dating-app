import mongoose from 'mongoose';

const profileUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female'],
    },
    bio: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/],
    },
  },
  { timestamps: true },
);

const ProfileUser = mongoose.model('ProfileUser', profileUserSchema);

export default ProfileUser;
