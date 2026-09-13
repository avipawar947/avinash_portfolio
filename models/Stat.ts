import { Schema, Types, model, models } from 'mongoose';

const StatSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    label: { type: String, required: true },
    labelMuted: { type: String, default: '' }, // second label line, flat #B0B0B0 at 30%
    value: { type: String, required: true }, // "04", "90", "80"
    suffix: { type: String, default: '+' },   // "+", "%"
    column: { type: Number, enum: [1, 3], default: 1 }, // which grid column the card sits in
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Stat || model('Stat', StatSchema);