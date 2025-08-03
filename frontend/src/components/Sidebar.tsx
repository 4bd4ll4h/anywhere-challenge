import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  TrendingUp as PerformanceIcon,
  Announcement as AnnouncementIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

interface SidebarProps {
  onLogout: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, active: true },
  { text: 'Schedule', icon: <ScheduleIcon /> },
  { text: 'Courses', icon: <SchoolIcon /> },
  { text: 'Gradebook', icon: <GradeIcon /> },
  { text: 'Performance', icon: <PerformanceIcon /> },
  { text: 'Announcement', icon: <AnnouncementIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          Coligo
        </Typography>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
                backgroundColor: item.active ? 'secondary.main' : 'transparent',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
                '&.Mui-selected': {
                  backgroundColor: 'secondary.main',
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.active ? 'white' : 'white',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: item.active ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: 1,
              color: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: 'primary.main',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'white',
                minWidth: 40,
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar; 