import mongoose, { Schema, Document, Model } from 'mongoose';

// chat message interface 
export interface IChatMessage extends Document {
  courseId: string;
  user: {
    name: string;
    avatar?: string;
    userId: string;
  };
  text: string;
  timestamp: number;
  reactions?: { [emoji: string]: string[] };
  edited?: boolean;
  flagged?: boolean;
  parentId?: string; 
  deleted?: boolean;
  deletedAt?: number;
  deletedBy?: string;
}

// chat message schema definition
const ChatMessageSchema: Schema<IChatMessage> = new Schema({
  courseId: { type: String, required: true, index: true },
  user: {
    name: { type: String, required: true },
    avatar: { type: String },
    userId: { type: String, required: true },
  },
  text: { type: String, required: true },
  timestamp: { type: Number, required: true },
  reactions: { type: Object, default: {} },
  edited: { type: Boolean, default: false },
  flagged: { type: Boolean, default: false },
  parentId: { type: String, required: false }, 
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Number },
  deletedBy: { type: String },
});

export const ChatMessage: Model<IChatMessage> =
  mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema); 