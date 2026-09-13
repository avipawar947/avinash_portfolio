import { Schema, Types, model, models } from 'mongoose';

const ToolSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    name: { type: String, required: true },
iconKey: { type: String, default: '' }, // maps to a built-in inline SVG icon
  iconUrl: { type: String, default: '' },  // OR a custom uploaded icon
  iconPublicId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Tool || model('Tool', ToolSchema);
