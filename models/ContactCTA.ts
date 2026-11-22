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
      default:
        'https://www.linkedin.com/in/%F0%9D%90%80%F0%9D%90%AF%F0%9D%90%A2%F0%9D%90%A7%F0%9D%90%9A%F0%9D%90%AC%F0%9D%90%A1-%F0%9D%90%8F%F0%9D%90%9A%F0%9D%90%B0%F0%9D%90%9A%F0%9D%90%AB-93248120b/',
    },
  },
  { timestamps: true }
);

export default models.ContactCTA || model('ContactCTA', ContactCTASchema);
