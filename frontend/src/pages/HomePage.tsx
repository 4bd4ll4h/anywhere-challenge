import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { School, Assignment, Announcement } from '@mui/icons-material';
import { RootState } from '../store';
import { login } from '../store/slices/authSlice';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    dispatch(login() as any);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white', mb: 4 }}>
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to Coligo
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                Your Student Dashboard
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                Access your courses, announcements, and assignments all in one place.
                Stay organized and never miss important updates from your teachers.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={loading}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                {loading ? 'Logging in...' : 'Login to Dashboard'}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent>
                    <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Course Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access all your courses and materials in one organized dashboard.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent>
                    <Assignment sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Assignments & Quizzes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track your assignments and quizzes with due dates and progress.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent>
                    <Announcement sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Announcements
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stay updated with important announcements from your teachers.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: 'info.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h4" color="white">
                        📊
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      Performance Tracking
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monitor your academic performance and progress over time.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 