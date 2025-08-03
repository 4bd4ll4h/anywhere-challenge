import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import RequireAuth from '../RequireAuth';
import authReducer from '../../store/slices/authSlice';

const createTestStore = (initialState: any) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: initialState,
    },
  });
};

const renderWithProviders = (component: React.ReactElement, initialState: any) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

// eslint-disable-next-line no-undef
describe('RequireAuth', () => {
  // eslint-disable-next-line no-undef
  it('should show loading when authentication is in progress', () => {
    const initialState = {
      isAuthenticated: false,
      loading: true,
      token: 'test-token',
    };

    renderWithProviders(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>,
      initialState
    );

    // Should show loading indicator
    // eslint-disable-next-line no-undef
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // eslint-disable-next-line no-undef
  it('should redirect to home when not authenticated', () => {
    const initialState = {
      isAuthenticated: false,
      loading: false,
      token: null,
    };

    renderWithProviders(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>,
      initialState
    );

    // Should not show protected content
    // eslint-disable-next-line no-undef
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  // eslint-disable-next-line no-undef
  it('should render children when authenticated', () => {
    const initialState = {
      isAuthenticated: true,
      loading: false,
      token: 'test-token',
    };

    renderWithProviders(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>,
      initialState
    );

    // Should show protected content
    // eslint-disable-next-line no-undef
    expect(screen.getByText('Protected Content')).toBeInTheDocument();

    // End of test suite
  });
});