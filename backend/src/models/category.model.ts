import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string; // <-- ADD THIS
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 500 }, // <-- ADD THIS
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Prevent duplicate category names for the same user
CategorySchema.index({ name: 1, user: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema);