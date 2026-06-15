import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, enum: ['admin', 'manager', 'user'], required: true, unique: true },
    description: String,
    permissions: [{ type: String }]
  },
  { timestamps: true }
);

export const Role = mongoose.model('Role', roleSchema);
