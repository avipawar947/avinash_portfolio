import { Schema, Types, model, models } from 'mongoose';

const ToolSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    name: { type: String, required: true },
    iconKey: { type: String, default: '' }, // maps to a built-in inline SVG icon
    iconUrl: { type: String, default: '' }, // OR a custom uploaded icon
    iconPublicId: { type: String, default: '' },
    // Constellation coordinates — the 94px tile's offset inside the
    // 1416 x 485 plot (Figma px).
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    // The glyph's own box inside the 94x94 tile. Figma uses one uniform
    // 45x45 box centred in every tile (24.5px inset), regardless of logo.
    iconSize: { type: Number, default: 45 },
    iconLeft: { type: Number, default: 24.5 },
    iconTop: { type: Number, default: 24.5 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Tool || model('Tool', ToolSchema);