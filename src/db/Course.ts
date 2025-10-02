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
  enrollments?: Array<{
    userId: mongoose.Types.ObjectId;
    enrolledAt: Date;
    completedAt?: Date;
    progress: number;
    lastAccessedAt?: Date;
  }>;
  ratings?: Array<{
    userId: mongoose.Types.ObjectId;
    rating: number;
    review?: string;
    createdAt: Date;
  }>;
  averageRating?: number;
  totalRatings?: number;
  discussions?: Array<{
    id: string;
    userId: mongoose.Types.ObjectId;
    content: string;
    parentId?: string;
    lessonIndex?: number;
    createdAt: Date;
    likes: mongoose.Types.ObjectId[];
    replies: string[];
    isInstructor: boolean;
  }>;
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
  enrollments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      enrolledAt: { type: Date, default: Date.now },
      completedAt: { type: Date },
      progress: { type: Number, default: 0 },
      lastAccessedAt: { type: Date, default: Date.now },
    },
  ],
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
  discussions: [
    {
      id: { type: String, required: true },
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      parentId: { type: String },
      lessonIndex: { type: Number },
      createdAt: { type: Date, default: Date.now },
      likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      replies: [{ type: String }],
      isInstructor: { type: Boolean, default: false },
    },
  ],
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
CourseSchema.index({ 'enrollments.userId': 1 });
CourseSchema.index({ 'discussions.userId': 1 });
CourseSchema.index({ 'discussions.lessonIndex': 1 });

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