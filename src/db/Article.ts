import mongoose, { Schema, Document, Model } from 'mongoose';

// article interface
export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  comments: Array<{
    user: mongoose.Types.ObjectId;
    comment: string;
    createdAt: Date;
  }>;
  likes: number;
  views: number;
}

// article schema definition
const ArticleSchema: Schema<IArticle> = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  coverImage: { type: String },
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
});

// indexes for performance optimization
ArticleSchema.index({ slug: 1 }, { unique: true });
ArticleSchema.index({ author: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

export const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema); 