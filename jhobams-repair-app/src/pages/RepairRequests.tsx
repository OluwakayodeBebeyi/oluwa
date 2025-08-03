import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Phone,
  Computer,
  Tablet,
  CheckCircle,
  Schedule,
  Build,
  LocalShipping,
  Payment,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';

interface RepairRequest {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  device: string;
  deviceModel: string;
  issue: string;
  description: string;
  status: 'Pending' | 'Diagnosed' | 'In Progress' | 'Completed' | 'Ready for Pickup' | 'Delivered';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  technician?: string;
  estimatedCost?: number;
  actualCost?: number;
  dateCreated: string;
  dateCompleted?: string;
  warranty: number; // days
}

const RepairRequests: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');

  // Mock data
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([
    {
      id: 'REP-001',
      customer: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+234 801 234 5678',
      device: 'Smartphone',
      deviceModel: 'iPhone 13 Pro',
      issue: 'Cracked Screen',
      description: 'Screen is completely shattered after drop. Touch functionality affected.',
      status: 'In Progress',
      priority: 'High',
      technician: 'Jane Tech',
      estimatedCost: 45000,
      actualCost: 42000,
      dateCreated: '2024-01-15',
      warranty: 30,
    },
    {
      id: 'REP-002',
      customer: 'Alice Johnson',
      customerEmail: 'alice@example.com',
      customerPhone: '+234 802 345 6789',
      device: 'Laptop',
      deviceModel: 'MacBook Pro 2021',
      issue: 'Battery Issues',
      description: 'Battery drains very quickly, lasts only 1-2 hours.',
      status: 'Completed',
      priority: 'Medium',
      technician: 'Mike Repair',
      estimatedCost: 85000,
      actualCost: 80000,
      dateCreated: '2024-01-10',
      dateCompleted: '2024-01-14',
      warranty: 90,
    },
    {
      id: 'REP-003',
      customer: 'Bob Smith',
      customerEmail: 'bob@example.com',
      customerPhone: '+234 803 456 7890',
      device: 'Tablet',
      deviceModel: 'iPad Air',
      issue: 'Charging Problems',
      description: 'Device not charging properly, charging port seems damaged.',
      status: 'Pending',
      priority: 'Low',
      dateCreated: '2024-01-16',
      warranty: 30,
    },
  ]);

  const [newRequest, setNewRequest] = useState<Partial<RepairRequest>>({
    customer: '',
    customerEmail: '',
    customerPhone: '',
    device: '',
    deviceModel: '',
    issue: '',
    description: '',
    priority: 'Medium',
    warranty: 30,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'success';
      case 'In Progress':
      case 'Diagnosed':
        return 'warning';
      case 'Ready for Pickup':
        return 'info';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'smartphone': return <Phone />;
      case 'tablet': return <Tablet />;
      case 'laptop': return <Computer />;
      default: return <Computer />;
    }
  };

  const handleCreateRequest = () => {
    const id = `REP-${String(repairRequests.length + 1).padStart(3, '0')}`;
    const request: RepairRequest = {
      ...newRequest as RepairRequest,
      id,
      status: 'Pending',
      dateCreated: dayjs().format('YYYY-MM-DD'),
    };
    setRepairRequests([...repairRequests, request]);
    setNewRequest({
      customer: '',
      customerEmail: '',
      customerPhone: '',
      device: '',
      deviceModel: '',
      issue: '',
      description: '',
      priority: 'Medium',
      warranty: 30,
    });
    setOpenDialog(false);
  };

  const handleViewRequest = (request: RepairRequest) => {
    setSelectedRequest(request);
    setViewMode('view');
    setOpenDialog(true);
  };

  const handleEditRequest = (request: RepairRequest) => {
    setSelectedRequest(request);
    setNewRequest(request);
    setViewMode('edit');
    setOpenDialog(true);
  };

  const filteredRequests = repairRequests.filter(request => {
    if (user?.role === 'customer') {
      return request.customerEmail === user.email;
    }
    switch (activeTab) {
      case 0: return true; // All
      case 1: return request.status === 'Pending';
      case 2: return ['Diagnosed', 'In Progress'].includes(request.status);
      case 3: return ['Completed', 'Ready for Pickup'].includes(request.status);
      default: return true;
    }
  });

  const getRepairSteps = (status: string) => {
    const steps = ['Received', 'Diagnosed', 'In Progress', 'Completed', 'Ready for Pickup'];
    return steps.map(step => ({
      label: step,
      completed: getStepIndex(status) >= steps.indexOf(step),
    }));
  };

  const getStepIndex = (status: string) => {
    const statusOrder = ['Pending', 'Diagnosed', 'In Progress', 'Completed', 'Ready for Pickup', 'Delivered'];
    return statusOrder.indexOf(status);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Repair Requests
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setViewMode('create');
            setSelectedRequest(null);
            setOpenDialog(true);
          }}
        >
          New Request
        </Button>
      </Box>

      {user?.role !== 'customer' && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="All Requests" />
              <Tab label="Pending" />
              <Tab label="In Progress" />
              <Tab label="Completed" />
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {request.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                          {request.customer.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{request.customer}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.customerPhone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getDeviceIcon(request.device)}
                        <Box>
                          <Typography variant="body2">{request.deviceModel}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.device}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{request.issue}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        color={getStatusColor(request.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.priority}
                        color={getPriorityColor(request.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{dayjs(request.dateCreated).format('MMM DD, YYYY')}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewRequest(request)}>
                          <Visibility />
                        </IconButton>
                        {(user?.role === 'admin' || user?.role === 'technician') && (
                          <IconButton size="small" onClick={() => handleEditRequest(request)}>
                            <Edit />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit/View Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode === 'create' ? 'New Repair Request' : 
           viewMode === 'edit' ? 'Edit Repair Request' : 'Repair Request Details'}
        </DialogTitle>
        <DialogContent>
          {viewMode === 'view' && selectedRequest ? (
            <Box sx={{ mt: 2 }}>
              {/* Progress Stepper */}
              <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Repair Progress</Typography>
                  <Stepper activeStep={getStepIndex(selectedRequest.status)} alternativeLabel>
                    {getRepairSteps(selectedRequest.status).map((step, index) => (
                      <Step key={step.label} completed={step.completed}>
                        <StepLabel>{step.label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Customer Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Name" secondary={selectedRequest.customer} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Email" secondary={selectedRequest.customerEmail} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Phone" secondary={selectedRequest.customerPhone} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Device Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Device Type" secondary={selectedRequest.device} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Model" secondary={selectedRequest.deviceModel} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Issue" secondary={selectedRequest.issue} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Issue Description</Typography>
                  <Typography variant="body2" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {selectedRequest.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Repair Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Status" secondary={
                        <Chip label={selectedRequest.status} color={getStatusColor(selectedRequest.status) as any} size="small" />
                      } />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Priority" secondary={
                        <Chip label={selectedRequest.priority} color={getPriorityColor(selectedRequest.priority) as any} size="small" />
                      } />
                    </ListItem>
                    {selectedRequest.technician && (
                      <ListItem>
                        <ListItemText primary="Assigned Technician" secondary={selectedRequest.technician} />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Cost & Warranty</Typography>
                  <List dense>
                    {selectedRequest.estimatedCost && (
                      <ListItem>
                        <ListItemText primary="Estimated Cost" secondary={`₦${selectedRequest.estimatedCost.toLocaleString()}`} />
                      </ListItem>
                    )}
                    {selectedRequest.actualCost && (
                      <ListItem>
                        <ListItemText primary="Actual Cost" secondary={`₦${selectedRequest.actualCost.toLocaleString()}`} />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemText primary="Warranty" secondary={`${selectedRequest.warranty} days`} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={newRequest.customer || ''}
                  onChange={(e) => setNewRequest({ ...newRequest, customer: e.target.value })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Email"
                  type="email"
                  value={newRequest.customerEmail || ''}
                  onChange={(e) => setNewRequest({ ...newRequest, customerEmail: e.target.value })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Phone"
                  value={newRequest.customerPhone || ''}
                  onChange={(e) => setNewRequest({ ...newRequest, customerPhone: e.target.value })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Device Type</InputLabel>
                  <Select
                    value={newRequest.device || ''}
                    label="Device Type"
                    onChange={(e) => setNewRequest({ ...newRequest, device: e.target.value })}
                    disabled={viewMode === 'view'}
                  >
                    <MenuItem value="Smartphone">Smartphone</MenuItem>
                    <MenuItem value="Tablet">Tablet</MenuItem>
                    <MenuItem value="Laptop">Laptop</MenuItem>
                    <MenuItem value="Desktop">Desktop</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Device Model"
                  value={newRequest.deviceModel || ''}
                  onChange={(e) => setNewRequest({ ...newRequest, deviceModel: e.target.value })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Issue"
                  value={newRequest.issue || ''}
                  onChange={(e) => setNewRequest({ ...newRequest, issue: e.target.value })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Detailed Description"
                  multiline
                  rows={4}
                  value={newRequest.description || ''}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newRequest.priority || 'Medium'}
                    label="Priority"
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as any })}
                    disabled={viewMode === 'view'}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Warranty (days)"
                  type="number"
                  value={newRequest.warranty || 30}
                  onChange={(e) => setNewRequest({ ...newRequest, warranty: parseInt(e.target.value) })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {viewMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {viewMode === 'create' && (
            <Button variant="contained" onClick={handleCreateRequest}>
              Create Request
            </Button>
          )}
          {viewMode === 'edit' && (
            <Button variant="contained" onClick={handleCreateRequest}>
              Save Changes
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RepairRequests;