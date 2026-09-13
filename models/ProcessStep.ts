import { Schema, Types, model, models } from 'mongoose';

const ProcessStepSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    phase: { type: String, enum: ['Discover', 'Define', 'Deliver'], required: true },
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.ProcessStep || model('ProcessStep', ProcessStepSchema);
