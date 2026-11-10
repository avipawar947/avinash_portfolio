import { Schema, Types, model, models } from 'mongoose';

const SectionKV = new Schema(
  {
    heading: { type: String, default: '' },
    body: { type: String, default: '' },
  },
  { _id: false }
);

const JourneyRow = new Schema(
  {
    stage: { type: String, default: '' },
    does: { type: String, default: '' },
    screens: { type: String, default: '' },
    helps: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const ImpactStat = new Schema(
  {
    value: { type: String, default: '' },
    suffix: { type: String, default: '' },
    label: { type: String, default: '' },
    desc: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const GalleryItem = new Schema(
  {
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const CaseStudySchema = new Schema(
  {
    heroEyebrow: { type: String, default: 'Case Study' },
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    heroBackgroundUrl: { type: String, default: '' },
    heroBackgroundPublicId: { type: String, default: '' },
    heroImageUrl: { type: String, default: '' },
    heroImagePublicId: { type: String, default: '' },
    websiteUrl: { type: String, default: '' },
    wireframeUrl: { type: String, default: '' },
    client: { type: String, default: '' },
    type: { type: String, default: '' },
    category: { type: String, default: '' },
    duration: { type: String, default: '' },
    role: { type: String, default: '' },
    overview: { type: SectionKV, default: undefined },
    challenges: { type: SectionKV, default: undefined },
    solutions: { type: SectionKV, default: undefined },
    infoArch: {
      heading: { type: String, default: '' },
      body: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },
      _id: false,
    },
    userJourney: {
      heading: { type: String, default: '' },
      body: { type: String, default: '' },
      rows: { type: [JourneyRow], default: [] },
      _id: false,
    },
    userFlow: {
      heading: { type: String, default: '' },
      body: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },
      _id: false,
    },
    designSystem: {
      heading: { type: String, default: '' },
      body: { type: String, default: '' },
      components: { type: [String], default: [] },
      colors: { type: [String], default: [] },
      iconsNote: { type: String, default: '' },
      typographyNote: { type: String, default: '' },
      colorsNote: { type: String, default: '' },
      _id: false,
    },
    wireframe: {
      heading: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },
      link: { type: String, default: '' },
      _id: false,
    },
    visual: {
      heading: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },
      link: { type: String, default: '' },
      _id: false,
    },
    impact: {
      heading: { type: String, default: '' },
      stats: { type: [ImpactStat], default: [] },
      _id: false,
    },
    conclusion: { type: SectionKV, default: undefined },
    gallery: { type: [GalleryItem], default: [] },
    // Legacy / CMS rich shape (already in MongoDB for qistonpe): keep so
    // lean reads/writes never strip the sections/blocks content.
    tagline: { type: [String], default: [] },
    logoUrl: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    iconSvgUrl: { type: String, default: '' },
    iconSvgPublicId: { type: String, default: '' },
    sectionIcons: {
      type: [
        new Schema(
          {
            key: { type: String, default: '' },
            svgUrl: { type: String, default: '' },
            svgPublicId: { type: String, default: '' },
            label: { type: String, default: '' },
            order: { type: Number, default: 0 },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    coverImageUrl: { type: String, default: '' },
    coverImagePublicId: { type: String, default: '' },
    meta: {
      type: [
        new Schema({ label: { type: String, default: '' }, value: { type: String, default: '' } }, { _id: false }),
      ],
      default: [],
    },
    sections: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    _id: { type: String, default: () => new Types.ObjectId().toString() },
    title: { type: String, required: true },
    slug: { type: String, default: '', unique: true, sparse: true, lowercase: true, trim: true },
    tag: { type: String, default: '' }, // e.g. "Case Study"
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    // Card + hero media can be an image OR a video (autoplay muted loop).
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    videoUrl: { type: String, default: '' },
    videoPublicId: { type: String, default: '' },
    videoPosterUrl: { type: String, default: '' },
    videoPosterPublicId: { type: String, default: '' },
    column: { type: String, enum: ['left', 'right'], default: 'left' },
    cropHeight: { type: Number, default: 100 },
    cropTop: { type: Number, default: 0 },
    wash: { type: Boolean, default: false },
    link: { type: String, default: '' },
    order: { type: Number, default: 0 },
    pagePublished: { type: Boolean, default: true },
    caseStudy: { type: CaseStudySchema, default: null },
  },
  { timestamps: true }
);

export default models.Project || model('Project', ProjectSchema);
