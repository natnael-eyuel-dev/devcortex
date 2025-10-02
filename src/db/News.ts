import mongoose, { Schema, Document, Model } from 'mongoose';

// news interface
export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;
  scheduledAt?: Date;
  tags: string[];
  category: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  engagement: {
    likes: mongoose.Types.ObjectId[];
    insightful: mongoose.Types.ObjectId[];
    controversial: mongoose.Types.ObjectId[];
    shares: number;
    bookmarks: mongoose.Types.ObjectId[];
    views: number;
  };
  comments: Array<{
    id: string;
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    parentId?: string;
    mentions: string[];
    likes: mongoose.Types.ObjectId[];
  }>;
  aiSummary?: string;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

// news schema definition
const NewsSchema: Schema<INews> = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  featuredImage: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'scheduled'], 
    default: 'draft' 
  },
  publishedAt: { type: Date },
  scheduledAt: { type: Date },
  tags: [{ type: String }],
  category: { type: String, required: true },
  seo: {
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    keywords: [{ type: String }]
  },
  engagement: {
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    insightful: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    controversial: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    shares: { type: Number, default: 0 },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 }
  },
  comments: [{
    id: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    parentId: { type: String },
    mentions: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }],
  aiSummary: { type: String },
  readingTime: { type: Number, default: 0 },
}, {
  timestamps: true
});

// indexes for performance optimization
NewsSchema.index({ status: 1, publishedAt: -1 });
NewsSchema.index({ category: 1 });
NewsSchema.index({ tags: 1 });
NewsSchema.index({ author: 1 });
NewsSchema.index({ 'engagement.likes': 1 });
NewsSchema.index({ 'engagement.bookmarks': 1 });

// pre-save hook to generate slug and calculate reading time
NewsSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  if (this.isModified('content')) {
    // calculate reading time (average 200 words per minute)
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

export const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', NewsSchema); 