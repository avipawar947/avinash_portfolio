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
    phone: { type: String, default: '+91 9325900669' },
    email: { type: String, default: 'avipawar947@gmail.com' },
    linkedinUrl: {
      type: String,
      default: 'https://www.linkedin.com/in/avinashpawar',
    },
  },
  { timestamps: true }
);

export default models.ContactCTA || model('ContactCTA', ContactCTASchema);
