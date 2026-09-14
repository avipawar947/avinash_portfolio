import { Schema, Types, model, models } from 'mongoose';

const GalleryImageSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    caption: { type: String, default: '' },
    left: { type: Number, default: 0 },
    top: { type: Number, default: 0 },
    height: { type: Number, default: 240 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.GalleryImage || model('GalleryImage', GalleryImageSchema);
