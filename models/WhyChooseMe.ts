import { Schema, model, models } from 'mongoose';

const ProjectMixBarSchema = new Schema(
  {
    label: { type: String, required: true },
    width: { type: Number, required: true }, // bar width against the 447px chart axis
  },
  { _id: false }
);

/**
 * Section-level config for "Why Choose Me" (Figma node 1:273).
 * Stat cards live in their own Stat collection; this singleton holds
 * the parts of the section that aren't per-card data: the bar chart
 * ("On Average Projects") and the domains worked across.
 */
const WhyChooseMeSchema = new Schema(
  {
    projectMix: { type: [ProjectMixBarSchema], default: [] },
    domains: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default models.WhyChooseMe || model('WhyChooseMe', WhyChooseMeSchema);