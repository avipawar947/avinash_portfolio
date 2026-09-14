import { Schema, Types, model, models } from 'mongoose';

const ProcessStepSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    phase: { type: String, enum: ['Discover', 'Define', 'Deliver'], required: true },
    label: { type: String, required: true },
    // Geometry inside the desktop table (Figma px from its top-left corner).
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    from: { type: Number, default: 55 }, // pill gradient white-stop %
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.ProcessStep || model('ProcessStep', ProcessStepSchema);