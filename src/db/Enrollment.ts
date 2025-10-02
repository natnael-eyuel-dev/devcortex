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
  progress: { type: Number, default: 0, min: 0, max: 100 },
  lastAccessedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// ensure a user cannot enroll in the same course multiple times
EnrollmentSchema.index({ courseId: 1, userId: 1 }, { unique: true });

// temporal and progress validation
EnrollmentSchema.pre('save', function(next) {
  if (this.completedAt && this.enrolledAt && this.completedAt < this.enrolledAt) {
    return next(new Error('completedAt cannot be earlier than enrolledAt.'));
  }
  if (typeof this.progress === 'number' && (this.progress < 0 || this.progress > 100)) {
    return next(new Error('progress must be between 0 and 100.'));
  }
  return next();
});

export const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
