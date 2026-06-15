import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    url: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    shortCode: { type: String, required: true, index: true },
    visitedAt: { type: Date, default: Date.now, index: true },
    browser: { type: String, default: 'Unknown' },
    device: { type: String, default: 'Desktop' },
    os: { type: String, default: 'Unknown' },
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' },
    referrer: { type: String, default: 'Direct' },
    ip: { type: String, select: false },
    userAgent: { type: String, select: false },
    isBot: { type: Boolean, default: false },
    fraudScore: { type: Number, min: 0, max: 100, default: 0 },
    reason: String
  },
  { timestamps: true }
);

export const Visit = mongoose.model('Visit', visitSchema);
