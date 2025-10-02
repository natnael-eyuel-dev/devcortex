import mongoose, { Schema, Document, Model } from 'mongoose';

// enrollment interface
export interface IEnrollment extends Document {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;
  lastAccessedAt?: Date;
}

// enrollment schema definition
const EnrollmentSchema: Schema<IEnrollment> = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  progress: { type: Number, default: 0 },
  lastAccessedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// ensure a user cannot enroll in the same course multiple times
EnrollmentSchema.index({ courseId: 1, userId: 1 }, { unique: true });

export const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
