import { Schema, model, models } from 'mongoose';

/**
 * Right-hand copy for "Our Process" — nodes 1:210 to 1:213. Singleton.
 */
const ProcessIntroSchema = new Schema(
  {
    heading: { type: String, default: 'A Thoughtful Process.' },
    lead: { type: String, default: '' }, // gradient-filled line
    rest: { type: [String], default: [] }, // flat muted lines
  },
  { timestamps: true }
);

export default models.ProcessIntro || model('ProcessIntro', ProcessIntroSchema);