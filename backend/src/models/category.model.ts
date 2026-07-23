import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Prevent a single user from having duplicate category names
CategorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema);