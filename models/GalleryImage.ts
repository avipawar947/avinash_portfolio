import { Schema, Types, model, models } from 'mongoose';

const GalleryImageSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.GalleryImage || model('GalleryImage', GalleryImageSchema);
