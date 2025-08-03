import mongoose, { Document, Schema } from 'mongoose';

export interface IQuiz extends Document {
  title: string;
  description: string;
  course: string;
  subject: string;
  topic: string;
  type: 'quiz' | 'assignment';
  dueDate: Date;
  duration?: number; // in minutes
  totalPoints: number;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  isActive: boolean;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true,
    maxlength: [100, 'Course cannot be more than 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot be more than 100 characters']
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
    maxlength: [200, 'Topic cannot be more than 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['quiz', 'assignment'],
    default: 'quiz'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  duration: {
    type: Number,
    min: [1, 'Duration must be at least 1 minute'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  totalPoints: {
    type: Number,
    required: [true, 'Total points is required'],
    min: [1, 'Total points must be at least 1'],
    max: [1000, 'Total points cannot exceed 1000']
  },
  questions: [{
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    options: [{
      type: String,
      required: [true, 'Option is required'],
      trim: true
    }],
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: [0, 'Correct answer index must be at least 0']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: [1000, 'Instructions cannot be more than 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if quiz is overdue
quizSchema.virtual('isOverdue').get(function() {
  return this.dueDate < new Date();
});

// Virtual for time remaining
quizSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const timeDiff = this.dueDate.getTime() - now.getTime();
  return Math.max(0, timeDiff);
});

// Indexes for better query performance
quizSchema.index({ dueDate: 1 });
quizSchema.index({ isActive: 1 });
quizSchema.index({ type: 1 });
quizSchema.index({ course: 1 });

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema); 