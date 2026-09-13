import { Schema, model, models } from 'mongoose';

const SettingsSchema = new Schema(
  {
    resumePdfUrl: { type: String, default: '' },
    resumePdfPublicId: { type: String, default: '' },
    seoTitle: { type: String, default: 'Avinash Pawar — Product Designer' },
    seoDescription: { type: String, default: 'UI/UX & Product Designer portfolio.' },
  },
  { timestamps: true }
);

export default models.Settings || model('Settings', SettingsSchema);
