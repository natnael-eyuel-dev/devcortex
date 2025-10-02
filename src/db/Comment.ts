import mongoose, { Schema, Document, Model } from 'mongoose';

// comment interface
export interface IComment extends Document {
  refType: 'Article' | 'News' | 'Course';
  refId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  comment: string;
  createdAt: Date;
  parentId?: mongoose.Types.ObjectId;
  mentions?: string[];
  likes?: mongoose.Types.ObjectId[];
}

// comment schema definition
const MAX_COMMENT_DEPTH = 3;

const CommentSchema: Schema<IComment> = new Schema({
  refType: { type: String, enum: ['Article', 'News', 'Course'], required: true },
  refId: { type: Schema.Types.ObjectId, required: true, index: true, refPath: 'refType' },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
  mentions: [{ type: String }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// validate parentId belongs to same ref and enforce max depth
CommentSchema.pre('save', async function(next) {
  try {
    if (!this.parentId) return next();

    const parent = await (this.constructor as mongoose.Model<IComment>).findById(this.parentId).select('refType refId parentId');
    if (!parent) return next(new Error('Parent comment not found.'));

    if (!parent.refId.equals(this.refId) || parent.refType !== this.refType) {
      return next(new Error('Parent comment must belong to the same resource.'));
    }

    // compute depth
    let depth = 1;
    let cursor = parent as IComment | null;
    while (cursor && cursor.parentId) {
      depth += 1;
      if (depth > MAX_COMMENT_DEPTH) {
        return next(new Error(`Maximum comment depth of ${MAX_COMMENT_DEPTH} exceeded.`));
      }
      cursor = await (this.constructor as mongoose.Model<IComment>).findById(cursor.parentId).select('parentId');
    }

    // prevent self-referential or cyclic parent
    if (this._id && this.parentId.equals(this._id)) {
      return next(new Error('A comment cannot be its own parent.'));
    }

    return next();
  } catch (err) {
    return next(err as Error);
  }
});

CommentSchema.index({ refType: 1, refId: 1 });
CommentSchema.index({ user: 1 });

// indexes for performance optimization
CommentSchema.index({ refType: 1, refId: 1 });
CommentSchema.index({ user: 1 });

export const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
