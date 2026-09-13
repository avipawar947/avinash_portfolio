import { Schema, Types, model, models } from 'mongoose';

const ClientLogoSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    name: { type: String, required: true },
    logoUrl: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    width: { type: Number, default: 0 },
    luminosity: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.ClientLogo || model('ClientLogo', ClientLogoSchema);
