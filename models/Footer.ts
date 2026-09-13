import { Schema, model, models } from 'mongoose';

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true }, // "linkedin" | "behance" | "gmail" | "twitter"
    url: { type: String, required: true },
  },
  { _id: false }
);

const FooterSchema = new Schema(
  {
    copyrightText: { type: String, default: '© 2026 Avinash M. Pawar. All rights reserved.' },
    roleTags: { type: [String], default: ['UI/UX Designer', 'Product Designer'] },
    location: { type: String, default: 'Mumbai, India' },
    socialLinks: { type: [SocialLinkSchema], default: [] },
  },
  { timestamps: true }
);

export default models.Footer || model('Footer', FooterSchema);
