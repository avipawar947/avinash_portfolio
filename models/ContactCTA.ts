import { Schema, model, models } from 'mongoose';

const ContactCTATabSchema = new Schema(
  {
    label: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
  },
  { _id: false }
);

const ContactCTASchema = new Schema(
  {
    tabs: { type: [ContactCTATabSchema], default: [] },
  },
  { timestamps: true }
);

export default models.ContactCTA || model('ContactCTA', ContactCTASchema);
