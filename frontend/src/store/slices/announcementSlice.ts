import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { announcementAPI } from '../../services/api';

export interface Announcement {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementState {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (
    params: { page?: number; limit?: number; priority?: string; isActive?: boolean; course?: string } | undefined = undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await announcementAPI.getAnnouncements(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch announcements');
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async (announcementData: Partial<Announcement>, { rejectWithValue }) => {
    try {
      const response = await announcementAPI.createAnnouncement(announcementData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create announcement');
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  'announcements/updateAnnouncement',
  async ({ id, data }: { id: string; data: Partial<Announcement> }, { rejectWithValue }) => {
    try {
      const response = await announcementAPI.updateAnnouncement(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update announcement');
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  'announcements/deleteAnnouncement',
  async (id: string, { rejectWithValue }) => {
    try {
      await announcementAPI.deleteAnnouncement(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete announcement');
    }
  }
);

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create announcement
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.announcements.unshift(action.payload.data);
      })
      // Update announcement
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.announcements.findIndex(a => a._id === action.payload.data._id);
        if (index !== -1) {
          state.announcements[index] = action.payload.data;
        }
      })
      // Delete announcement
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(a => a._id !== action.payload);
      });
  },
});

export const { clearError } = announcementSlice.actions;
export default announcementSlice.reducer; 