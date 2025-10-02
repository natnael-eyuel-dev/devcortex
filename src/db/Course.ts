import mongoose, { Schema, Document, Model } from 'mongoose';

// course interface
export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  lessons: Array<{
    title: string;
    content: string;
    videoUrl?: string;
  }>;
  price: 'free' | 'paid';
  duration: number;
  students: mongoose.Types.ObjectId[];
  author?: mongoose.Types.ObjectId;
  coverImage?: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'scheduled';
  scheduledAt?: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  ratings?: Array<{
    userId: mongoose.Types.ObjectId;
    rating: number;
    review?: string;
    createdAt: Date;
  }>;
  averageRating?: number;
  totalRatings?: number;
}

// course schema definition
const CourseSchema: Schema<ICourse> = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  lessons: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      videoUrl: { type: String },
    },
  ],
  price: { type: String, enum: ['free', 'paid'], required: true },
  duration: { type: Number, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  coverImage: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  scheduledAt: { type: Date },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
  },
  ratings: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      review: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// indexes for performance optimization
CourseSchema.index({ slug: 1 }, { unique: true });
CourseSchema.index({ difficulty: 1 });
CourseSchema.index({ price: 1 });
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ author: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ category: 1 });

// calculate average rating when ratings change
CourseSchema.pre('save', function(next) {
  if (this.isModified('ratings')) {
    if (this.ratings && this.ratings.length > 0) {
      const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
      this.averageRating = totalRating / this.ratings.length;
      this.totalRatings = this.ratings.length;
    } else {
      this.averageRating = 0;
      this.totalRatings = 0;
    }
  }
  next();
});

export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema); 