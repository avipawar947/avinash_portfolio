import { Schema, Types, model, models } from 'mongoose';

const ProjectSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    title: { type: String, required: true },
    tag: { type: String, default: '' }, // e.g. "Case Study"
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    column: { type: String, enum: ['left', 'right'], default: 'left' },
    cropHeight: { type: Number, default: 100 },
    cropTop: { type: Number, default: 0 },
    wash: { type: Boolean, default: false },
    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Project || model('Project', ProjectSchema);
