import { Schema, model, models } from 'mongoose';

const HeroSchema = new Schema(
  {
    name: { type: String, default: 'Avinash Pawar' },
    taglineTop: { type: String, default: 'PRODUCT' },
    taglineBottom: { type: String, default: 'DESIGNER' },
    badgeText: { type: String, default: 'Hello, My Name Is' },
    statusText: { type: String, default: 'Open to Work' },
    statusActive: { type: Boolean, default: true },
    characterImageUrl: { type: String, default: '' },
    characterImagePublicId: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.Hero || model('Hero', HeroSchema);
