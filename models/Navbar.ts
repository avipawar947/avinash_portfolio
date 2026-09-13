import { Schema, model, models } from 'mongoose';

const NavLinkSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const NavbarSchema = new Schema(
  {
    logoText: { type: String, default: 'AVINASH PAWAR' },
    logoImageUrl: { type: String, default: '' },
    links: { type: [NavLinkSchema], default: [] },
    resumeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.Navbar || model('Navbar', NavbarSchema);
