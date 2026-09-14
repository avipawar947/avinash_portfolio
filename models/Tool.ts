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
    // The glyph's own box inside the 94x94 tile (Figma px; most are
    // 60x60 inset 17px, but Claude, Magnific and LottieFiles differ).
    iconSize: { type: Number, default: 60 },
    iconLeft: { type: Number, default: 17 },
    iconTop: { type: Number, default: 17 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Tool || model('Tool', ToolSchema);