import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  subject?: string;
  course?: string;
  type: 'general' | 'academic' | 'urgent';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true
    },
    avatar: {
      type: String,
      default: 'https://picsum.photos/150'
    },
    role: {
      type: String,
      required: [true, 'Author role is required'],
      enum: ['teacher', 'admin', 'management']
    }
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [100, 'Subject cannot be more than 100 characters']
  },
  course: {
    type: String,
    trim: true,
    maxlength: [100, 'Course cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['general', 'academic', 'urgent'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ isActive: 1 });
announcementSchema.index({ priority: 1 });

export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema); 