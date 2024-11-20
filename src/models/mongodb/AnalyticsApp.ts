import mongoose, { Schema } from 'mongoose';
import type { AnalyticsApp } from '@/types/schema';

const analyticsAppSchema = new Schema<AnalyticsApp>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline', 'maintenance'], required: true },
  category: { type: String, required: true },
  tags: [{ type: String, required: true }],
  lastChecked: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
}, {
  timestamps: true
});

// Create indexes for better query performance
analyticsAppSchema.index({ status: 1 });
analyticsAppSchema.index({ category: 1 });
analyticsAppSchema.index({ lastChecked: -1 });

export default mongoose.models.AnalyticsApp || mongoose.model<AnalyticsApp>('AnalyticsApp', analyticsAppSchema);
