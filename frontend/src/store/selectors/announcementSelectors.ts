import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Base selectors
const selectAnnouncementState = (state: RootState) => state.announcements;

// Memoized selectors
export const selectAnnouncements = createSelector(
  [selectAnnouncementState],
  (announcements) => announcements.announcements
);

export const selectAnnouncementLoading = createSelector(
  [selectAnnouncementState],
  (announcements) => announcements.loading
);

export const selectAnnouncementError = createSelector(
  [selectAnnouncementState],
  (announcements) => announcements.error
);

export const selectAnnouncementPagination = createSelector(
  [selectAnnouncementState],
  (announcements) => announcements.pagination
);

// Derived selectors
export const selectActiveAnnouncements = createSelector(
  [selectAnnouncements],
  (announcements) => announcements.filter(announcement => announcement.isActive)
);

export const selectAnnouncementsByPriority = createSelector(
  [selectAnnouncements, (_state: RootState, priority: string) => priority],
  (announcements, priority) => announcements.filter(announcement => announcement.priority === priority)
);

export const selectAnnouncementsByType = createSelector(
  [selectAnnouncements, (_state: RootState, type: string) => type],
  (announcements, type) => announcements.filter(announcement => announcement.type === type)
);

export const selectAnnouncementById = createSelector(
  [selectAnnouncements, (_state: RootState, id: string) => id],
  (announcements, id) => announcements.find(announcement => announcement._id === id)
); 