import mongoose, { Schema, Document, Model } from 'mongoose';

// comment interface
export interface IComment extends Document {
  refType: 'Article' | 'News';
  refId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  comment: string;
  createdAt: Date;
  parentId?: string;
  mentions?: string[];
  likes?: mongoose.Types.ObjectId[];
}

// comment schema definition
const CommentSchema: Schema<IComment> = new Schema({
  refType: { type: String, enum: ['Article', 'News'], required: true },
  refId: { type: Schema.Types.ObjectId, required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: String },
  mentions: [{ type: String }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// indexes for performance optimization
CommentSchema.index({ refType: 1, refId: 1 });
CommentSchema.index({ user: 1 });

export const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
