import mongoose, { Schema, Document, Model } from 'mongoose';

// follow interface
export interface IFollow extends Document {
  follower: mongoose.Types.ObjectId;
  following: mongoose.Types.ObjectId;
  followedAt: Date;
}

// follow schema definition
const FollowSchema: Schema<IFollow> = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  following: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  followedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// ensure a user cannot follow the same person multiple times
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

FollowSchema.pre('save', function(next) {
  if (this.follower.equals(this.following)) {
    next(new Error('A user cannot follow themselves.'));
  } else {
    next();
  }
});

export const Follow: Model<IFollow> = mongoose.models.Follow || mongoose.model<IFollow>('Follow', FollowSchema);
