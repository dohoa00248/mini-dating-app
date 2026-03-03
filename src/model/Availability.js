import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProfileUser',
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProfileUser',
      required: true,
    },

    slots: {
      type: Map,
      of: [
        {
          start: Date,
          end: Date,
        },
      ],
      default: {},
    },

    finalDate: {
      start: Date,
      end: Date,
    },
  },
  { timestamps: true },
);

availabilitySchema.index({ userA: 1, userB: 1 }, { unique: true });

const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;
