import { Schema, Types, model, models } from 'mongoose';

const StatSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    label: { type: String, required: true },
    value: { type: String, required: true }, // "04", "90", "80"
    suffix: { type: String, default: '+' },   // "+", "%"
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Stat || model('Stat', StatSchema);
