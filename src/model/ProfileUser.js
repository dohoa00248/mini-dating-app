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
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProfileUser' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProfileUser' }],
  },
  { timestamps: true },
);

const ProfileUser = mongoose.model('ProfileUser', profileUserSchema);

export default ProfileUser;
