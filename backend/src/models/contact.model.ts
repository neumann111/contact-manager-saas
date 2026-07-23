import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  user: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  company?: string;
  isFavorite: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phoneNumber: { type: String, trim: true },
    company: { type: String, trim: true },
    isFavorite: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

// A user cannot have two contacts with the exact same email
// partialFilterExpression ensures we only check uniqueness if an email is provided
ContactSchema.index(
  { user: 1, email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string', $exists: true } } }
);

export default mongoose.model<IContact>('Contact', ContactSchema);