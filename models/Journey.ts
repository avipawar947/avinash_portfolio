import { Schema, model, models } from 'mongoose';

const JourneyLineSchema = new Schema(
  {
    text: { type: String, required: true },
    opacity: { type: Number, default: 1 }, // matches the fading-line effect in the design
  },
  { _id: false }
);

const JourneySchema = new Schema(
  {
    heading: { type: String, default: 'My Journey' },
    lines: { type: [JourneyLineSchema], default: [] },
  },
  { timestamps: true }
);

export default models.Journey || model('Journey', JourneySchema);
