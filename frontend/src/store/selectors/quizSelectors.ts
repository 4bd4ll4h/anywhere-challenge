import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Base selectors
const selectQuizState = (state: RootState) => state.quizzes;

// Memoized selectors
export const selectQuizzes = createSelector(
  [selectQuizState],
  (quizzes) => quizzes.quizzes
);

export const selectQuizLoading = createSelector(
  [selectQuizState],
  (quizzes) => quizzes.loading
);

export const selectQuizError = createSelector(
  [selectQuizState],
  (quizzes) => quizzes.error
);

export const selectQuizPagination = createSelector(
  [selectQuizState],
  (quizzes) => quizzes.pagination
);

// Derived selectors
export const selectActiveQuizzes = createSelector(
  [selectQuizzes],
  (quizzes) => quizzes.filter(quiz => quiz.isActive)
);

export const selectUpcomingQuizzes = createSelector(
  [selectQuizzes],
  (quizzes) => quizzes.filter(quiz => new Date(quiz.dueDate) > new Date())
);

export const selectQuizById = createSelector(
  [selectQuizzes, (_state: RootState, id: string) => id],
  (quizzes, id) => quizzes.find(quiz => quiz._id === id)
); 