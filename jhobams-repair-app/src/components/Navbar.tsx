import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Build,
  People,
  Inventory,
  Assessment,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseMenu();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Repair Requests', icon: <Build />, path: '/requests' },
    { text: 'Customers', icon: <People />, path: '/customers' },
    { text: 'Inventory', icon: <Inventory />, path: '/inventory' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (user?.role === 'customer') {
      return ['Dashboard', 'Repair Requests'].includes(item.text);
    }
    return true;
  });

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Jhobams Multiconcepts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ICT Repair Services
        </Typography>
      </Box>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (!user) {
    return null;
  }

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {isMobile ? 'Jhobams' : 'Jhobams Multiconcepts Limited'}
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {filteredMenuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <IconButton color="inherit" onClick={handleProfileMenu}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
              {user.name.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <AccountCircle sx={{ mr: 1 }} />
              {user.name} ({user.role})
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseMenu}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;