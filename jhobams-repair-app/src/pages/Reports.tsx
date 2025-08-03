import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  PieChart as PieChartIcon,
  Download,
  DateRange,
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState(dayjs());

  // Mock data for reports
  const overviewData = {
    totalRevenue: 1245000,
    totalRepairs: 156,
    avgRepairTime: 3.2,
    customerSatisfaction: 4.7,
    revenueGrowth: 15.3,
    repairGrowth: 12.8,
  };

  const monthlyRevenue = [
    { month: 'Jul', revenue: 185000, repairs: 28 },
    { month: 'Aug', revenue: 210000, repairs: 32 },
    { month: 'Sep', revenue: 195000, repairs: 29 },
    { month: 'Oct', revenue: 235000, repairs: 35 },
    { month: 'Nov', revenue: 220000, repairs: 31 },
    { month: 'Dec', revenue: 245000, repairs: 38 },
  ];

  const deviceTypeRevenue = [
    { name: 'Smartphones', value: 45, revenue: 560000, color: '#1976d2' },
    { name: 'Laptops', value: 30, revenue: 374000, color: '#dc004e' },
    { name: 'Tablets', value: 15, revenue: 187000, color: '#9c27b0' },
    { name: 'Other', value: 10, revenue: 124000, color: '#ff9800' },
  ];

  const repairTrends = [
    { week: 'Week 1', completed: 12, pending: 8, inProgress: 15 },
    { week: 'Week 2', completed: 15, pending: 6, inProgress: 12 },
    { week: 'Week 3', completed: 18, pending: 4, inProgress: 14 },
    { week: 'Week 4', completed: 14, pending: 7, inProgress: 16 },
  ];

  const topCustomers = [
    { name: 'John Doe', repairs: 8, revenue: 125000, lastVisit: '2024-01-15' },
    { name: 'Alice Johnson', repairs: 3, revenue: 95000, lastVisit: '2024-01-10' },
    { name: 'Tech Solutions Ltd', repairs: 12, revenue: 215000, lastVisit: '2024-01-12' },
    { name: 'Bob Smith', repairs: 1, revenue: 15000, lastVisit: '2024-01-16' },
    { name: 'City Electronics', repairs: 7, revenue: 98000, lastVisit: '2024-01-08' },
  ];

  const commonIssues = [
    { issue: 'Cracked Screen', count: 45, percentage: 28.8 },
    { issue: 'Battery Issues', count: 32, percentage: 20.5 },
    { issue: 'Charging Problems', count: 28, percentage: 17.9 },
    { issue: 'Water Damage', count: 18, percentage: 11.5 },
    { issue: 'Software Issues', count: 15, percentage: 9.6 },
    { issue: 'Camera Problems', count: 12, percentage: 7.7 },
    { issue: 'Speaker Issues', count: 6, percentage: 3.8 },
  ];

  const technicianPerformance = [
    { name: 'Jane Tech', completed: 45, avgTime: 2.8, satisfaction: 4.8, revenue: 425000 },
    { name: 'Mike Repair', completed: 38, avgTime: 3.2, satisfaction: 4.6, revenue: 380000 },
    { name: 'Sarah Fix', completed: 42, avgTime: 2.9, satisfaction: 4.7, revenue: 398000 },
    { name: 'Tom Service', completed: 31, avgTime: 3.5, satisfaction: 4.4, revenue: 315000 },
  ];

  const StatCard = ({ title, value, subtitle, change, icon, color = 'primary' }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
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
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: change > 0 ? 'success.main' : 'error.main', mr: 0.5 }} />
                <Typography variant="body2" color={change > 0 ? 'success.main' : 'error.main'}>
                  {change > 0 ? '+' : ''}{change}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderOverviewReport = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₦${overviewData.totalRevenue.toLocaleString()}`}
            subtitle="Last 30 days"
            change={overviewData.revenueGrowth}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Repairs"
            value={overviewData.totalRepairs}
            subtitle="Completed repairs"
            change={overviewData.repairGrowth}
            icon={<Assessment sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Repair Time"
            value={`${overviewData.avgRepairTime} days`}
            subtitle="From receipt to completion"
            icon={<DateRange sx={{ fontSize: 40 }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Customer Rating"
            value={`${overviewData.customerSatisfaction}/5.0`}
            subtitle="Average satisfaction"
            icon={<PieChartIcon sx={{ fontSize: 40 }} />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Revenue & Repair Trends
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.6}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="repairs" stroke="#dc004e" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Revenue by Device Type
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceTypeRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceTypeRevenue.map((entry, index) => (
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
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Top Customers
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Repairs</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCustomers.slice(0, 5).map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell align="right">{customer.repairs}</TableCell>
                        <TableCell align="right">₦{customer.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Common Issues
              </Typography>
              <Box sx={{ mt: 2 }}>
                {commonIssues.slice(0, 6).map((issue, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{issue.issue}</Typography>
                      <Typography variant="body2">{issue.count}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                      <Box
                        sx={{
                          bgcolor: 'primary.main',
                          borderRadius: 1,
                          height: '100%',
                          width: `${issue.percentage}%`,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  const renderTechnicianReport = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Technician Performance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Technician</TableCell>
                <TableCell align="right">Completed Repairs</TableCell>
                <TableCell align="right">Avg Repair Time (days)</TableCell>
                <TableCell align="right">Customer Rating</TableCell>
                <TableCell align="right">Revenue Generated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {technicianPerformance.map((tech, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {tech.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{tech.completed}</TableCell>
                  <TableCell align="right">{tech.avgTime}</TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${tech.satisfaction}/5.0`} 
                      color={tech.satisfaction >= 4.5 ? 'success' : tech.satisfaction >= 4.0 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">₦{tech.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderRepairTrendsReport = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Weekly Repair Status Trends
        </Typography>
        <Box sx={{ height: 400, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={repairTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" stackId="a" fill="#4caf50" name="Completed" />
              <Bar dataKey="inProgress" stackId="a" fill="#ff9800" name="In Progress" />
              <Bar dataKey="pending" stackId="a" fill="#f44336" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Reports & Analytics
        </Typography>
        <Button variant="outlined" startIcon={<Download />}>
          Export Report
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="overview">Business Overview</MenuItem>
                  <MenuItem value="technician">Technician Performance</MenuItem>
                  <MenuItem value="trends">Repair Trends</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <MenuItem value="last7days">Last 7 days</MenuItem>
                  <MenuItem value="last30days">Last 30 days</MenuItem>
                  <MenuItem value="last90days">Last 90 days</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {dateRange === 'custom' && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Report Content */}
      {reportType === 'overview' && renderOverviewReport()}
      {reportType === 'technician' && renderTechnicianReport()}
      {reportType === 'trends' && renderRepairTrendsReport()}
    </Container>
  );
};

export default Reports;