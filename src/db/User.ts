import mongoose, { Schema, Document, Model } from 'mongoose';

// notification interface
export interface Notification {
  type: string;
  message: string;
  date: Date;
  read: boolean;
  refId?: string;
  fromUser?: string;
}

// user interface 
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  avatar3D?: string;
  coverImage?: string;
  role: 'user' | 'author' | 'admin';
  roleBadgeStyle?: string;
  socialLinks?: Array<{ type: string; url: string }>;
  bio?: string;
  location?: string;
  skills?: Array<{ name: string; level: number; source: 'auto' | 'manual' }>;
  currentStack?: Array<{ tech: string; proficiency: number }>;
  contributionHeatmap?: Record<string, number>;
  progressTimeline?: Array<{ type: string; refId?: string; date: Date; description?: string; milestone?: boolean }>;
  projects?: Array<{ id: string; title: string; url?: string; description?: string; image?: string }>;
  featuredProject?: { id: string; title: string; url?: string; description?: string; image?: string };
  endorsements?: Array<{ fromUser: string; message: string; date: Date }>;
  certificates?: Array<{ type: string; imageUrl: string; isNFT?: boolean }>;
  badges?: Array<{ name: string; icon: string; date: Date }>;
  followers?: Array<string>;
  following?: Array<string>;
  recentActivity?: Array<{ type: string; refId?: string; date: Date; description?: string; milestone?: boolean }>;
  joinedAt: Date;
  lastLoginAt?: Date;
  marketingConsent: boolean;
  learningProgress: Array<{
    courseId: mongoose.Types.ObjectId;
    progress: number;
  }>;
  notifications?: Notification[];
}

// user schema definition
const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  avatar: { type: String },
  avatar3D: { type: String },
  coverImage: { type: String },
  role: { type: String, enum: ['user', 'author', 'admin'], default: 'user' },
  roleBadgeStyle: { type: String },
  socialLinks: [
    {
      type: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  bio: { type: String },
  location: { type: String },
  skills: [
    {
      name: { type: String },
      level: { type: Number },
      source: { type: String, enum: ['auto', 'manual'] },
    },
  ],
  currentStack: [
    {
      tech: { type: String },
      proficiency: { type: Number },
    },
  ],
  contributionHeatmap: { type: Map, of: Number },
  progressTimeline: [
    {
      type: { type: String },
      refId: { type: String },
      date: { type: Date },
      description: { type: String },
      milestone: { type: Boolean },
    },
  ],
  projects: [
    {
      id: { type: String },
      title: { type: String },
      url: { type: String },
      description: { type: String },
      image: { type: String },
    },
  ],
  featuredProject: {
    id: { type: String },
    title: { type: String },
    url: { type: String },
    description: { type: String },
    image: { type: String },
  },
  endorsements: [
    {
      fromUser: { type: String },
      message: { type: String },
      date: { type: Date },
    },
  ],
  certificates: [
    {
      type: { type: String },
      imageUrl: { type: String },
      isNFT: { type: Boolean },
    },
  ],
  badges: [
    {
      name: { type: String },
      icon: { type: String },
      date: { type: Date },
    },
  ],
  followers: [{ type: String }],
  following: [{ type: String }],
  recentActivity: [
    {
      type: { type: String },
      refId: { type: String },
      date: { type: Date },
      description: { type: String },
      milestone: { type: Boolean },
    },
  ],
  joinedAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
  marketingConsent: { type: Boolean, default: false },
  learningProgress: [
    {
      courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
      progress: { type: Number, default: 0 },
    },
  ],
  notifications: [
    {
      type: { type: String },
      message: { type: String },
      date: { type: Date },
      read: { type: Boolean, default: false },
      refId: { type: String },
      fromUser: { type: String },
    },
  ],
});

// indexes for performance optimization
UserSchema.index({ role: 1 });
UserSchema.index({ lastLoginAt: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 