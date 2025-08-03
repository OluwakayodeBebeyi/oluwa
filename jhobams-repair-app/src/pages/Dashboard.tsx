import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
} from '@mui/material';
import {
  Build,
  TrendingUp,
  People,
  CheckCircle,
  Schedule,
  Warning,
  Phone,
  Computer,
  Tablet,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const stats = {
    totalRepairs: 1247,
    activeRepairs: 43,
    completedToday: 12,
    pendingPickup: 8,
  };

  const recentRepairs = [
    { id: 'REP-001', device: 'iPhone 13 Pro', customer: 'John Doe', status: 'In Progress', issue: 'Screen replacement' },
    { id: 'REP-002', device: 'MacBook Pro', customer: 'Jane Smith', status: 'Completed', issue: 'Battery replacement' },
    { id: 'REP-003', device: 'Samsung Galaxy S21', customer: 'Bob Johnson', status: 'Pending', issue: 'Water damage' },
    { id: 'REP-004', device: 'iPad Air', customer: 'Alice Brown', status: 'In Progress', issue: 'Charging port' },
  ];

  const monthlyData = [
    { month: 'Jan', repairs: 89 },
    { month: 'Feb', repairs: 112 },
    { month: 'Mar', repairs: 95 },
    { month: 'Apr', repairs: 134 },
    { month: 'May', repairs: 156 },
    { month: 'Jun', repairs: 143 },
  ];

  const deviceTypeData = [
    { name: 'Smartphones', value: 45, color: '#1976d2' },
    { name: 'Laptops', value: 30, color: '#dc004e' },
    { name: 'Tablets', value: 15, color: '#9c27b0' },
    { name: 'Other', value: 10, color: '#ff9800' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'error';
      default: return 'default';
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('samsung')) {
      return <Phone />;
    } else if (device.toLowerCase().includes('ipad') || device.toLowerCase().includes('tablet')) {
      return <Tablet />;
    } else {
      return <Computer />;
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'primary' }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: `${color}.main` }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Here's what's happening at Jhobams Multiconcepts today
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Repairs"
            value={stats.totalRepairs.toLocaleString()}
            subtitle="All time"
            icon={<Build />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Repairs"
            value={stats.activeRepairs}
            subtitle="In progress"
            icon={<Schedule />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Today"
            value={stats.completedToday}
            subtitle="Ready for pickup"
            icon={<CheckCircle />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Pickup"
            value={stats.pendingPickup}
            subtitle="Awaiting collection"
            icon={<Warning />}
            color="error"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Monthly Repair Trends
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="repairs" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Device Types
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Repairs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Repair Requests
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List>
                {recentRepairs.map((repair, index) => (
                  <React.Fragment key={repair.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          {getDeviceIcon(repair.device)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {repair.id}
                            </Typography>
                            <Chip
                              label={repair.status}
                              size="small"
                              color={getStatusColor(repair.status) as any}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              <strong>{repair.device}</strong> • {repair.customer}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Issue: {repair.issue}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentRepairs.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        {(user?.role === 'admin' || user?.role === 'technician') && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  <Button variant="contained" startIcon={<Build />}>
                    New Repair Request
                  </Button>
                  <Button variant="outlined" startIcon={<People />}>
                    Add Customer
                  </Button>
                  <Button variant="outlined" startIcon={<TrendingUp />}>
                    Generate Report
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;