import mongoose from 'mongoose';

const healthSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['unknown', 'healthy', 'warning', 'down'], default: 'unknown' },
    httpStatus: Number,
    checkedAt: Date,
    message: String
  },
  { _id: false }
);

const urlSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    originalUrl: { type: String, required: true, trim: true },
    shortCode: { type: String, required: true, unique: true, trim: true, index: true },
    customAlias: { type: String, trim: true, sparse: true },
    title: { type: String, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500 },
    expiresAt: Date,
    passwordHash: { type: String, select: false },
    isPasswordProtected: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isPublicStatsEnabled: { type: Boolean, default: true },
    totalClicks: { type: Number, default: 0 },
    humanClicks: { type: Number, default: 0 },
    botClicks: { type: Number, default: 0 },
    lastVisitedAt: Date,
    health: { type: healthSchema, default: () => ({}) }
  },
  { timestamps: true }
);

urlSchema.virtual('status').get(function status() {
  if (!this.isActive) return 'Inactive';
  if (this.expiresAt && this.expiresAt < new Date()) return 'Expired';
  return 'Active';
});

urlSchema.set('toJSON', { virtuals: true });
urlSchema.set('toObject', { virtuals: true });

export const Url = mongoose.model('Url', urlSchema);
