import mongoose, { Schema, Document, Model } from 'mongoose';

// project idea interface 
export interface IProjectIdea extends Document {
  title: string;
  description: string;
  difficulty: string;
  techStack: string[];
  resources: string[];
  featuredImage?: string;
  screenshots?: string[];
  author: mongoose.Types.ObjectId;
}

// project idea schema definition
const ProjectIdeaSchema: Schema<IProjectIdea> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  techStack: [{ type: String }],
  resources: [{ type: String }],
  featuredImage: { type: String },
  screenshots: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// indexes for performance optimization
ProjectIdeaSchema.index({ author: 1 });
ProjectIdeaSchema.index({ difficulty: 1 });
ProjectIdeaSchema.index({ techStack: 1 });
ProjectIdeaSchema.index({ title: 'text', description: 'text' });

export const ProjectIdea: Model<IProjectIdea> = mongoose.models.ProjectIdea || mongoose.model<IProjectIdea>('ProjectIdea', ProjectIdeaSchema); 