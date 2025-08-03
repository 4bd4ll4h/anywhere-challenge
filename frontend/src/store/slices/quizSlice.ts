import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizAPI } from '../../services/api';

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  subject: string;
  topic: string;
  type: 'quiz' | 'assignment';
  dueDate: string;
  duration?: number;
  totalPoints: number;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  isActive: boolean;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizState {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: QuizState = {
  quizzes: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (
    params: { page?: number; limit?: number; type?: string; isActive?: boolean; course?: string } | undefined = undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await quizAPI.getQuizzes(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch quizzes');
    }
  }
);

export const fetchUpcomingQuizzes = createAsyncThunk(
  'quizzes/fetchUpcomingQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await quizAPI.getUpcomingQuizzes();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch upcoming quizzes');
    }
  }
);

export const createQuiz = createAsyncThunk(
  'quizzes/createQuiz',
  async (quizData: Partial<Quiz>, { rejectWithValue }) => {
    try {
      const response = await quizAPI.createQuiz(quizData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create quiz');
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'quizzes/updateQuiz',
  async ({ id, data }: { id: string; data: Partial<Quiz> }, { rejectWithValue }) => {
    try {
      const response = await quizAPI.updateQuiz(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update quiz');
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quizzes/deleteQuiz',
  async (id: string, { rejectWithValue }) => {
    try {
      await quizAPI.deleteQuiz(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete quiz');
    }
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch upcoming quizzes
      .addCase(fetchUpcomingQuizzes.fulfilled, (state, action) => {
        state.quizzes = action.payload.data;
      })
      // Create quiz
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes.unshift(action.payload.data);
      })
      // Update quiz
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex(q => q._id === action.payload.data._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload.data;
        }
      })
      // Delete quiz
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(q => q._id !== action.payload);
      });
  },
});

export const { clearError } = quizSlice.actions;
export default quizSlice.reducer; 