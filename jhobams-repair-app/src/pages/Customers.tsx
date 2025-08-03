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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Phone,
  Email,
  LocationOn,
  History,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateJoined: string;
  totalRepairs: number;
  totalSpent: number;
  lastRepair?: string;
  status: 'Active' | 'Inactive';
  repairHistory: {
    id: string;
    device: string;
    issue: string;
    cost: number;
    date: string;
    status: string;
  }[];
}

const Customers: React.FC = () => {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  const [activeTab, setActiveTab] = useState(0);

  // Mock data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUST-001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+234 801 234 5678',
      address: '123 Lagos Street, Victoria Island, Lagos',
      dateJoined: '2023-06-15',
      totalRepairs: 8,
      totalSpent: 125000,
      lastRepair: '2024-01-15',
      status: 'Active',
      repairHistory: [
        {
          id: 'REP-001',
          device: 'iPhone 13 Pro',
          issue: 'Cracked Screen',
          cost: 45000,
          date: '2024-01-15',
          status: 'Completed',
        },
        {
          id: 'REP-005',
          device: 'MacBook Air',
          issue: 'Keyboard Issues',
          cost: 25000,
          date: '2023-12-10',
          status: 'Completed',
        },
      ],
    },
    {
      id: 'CUST-002',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+234 802 345 6789',
      address: '456 Abuja Road, Wuse, Abuja',
      dateJoined: '2023-08-22',
      totalRepairs: 3,
      totalSpent: 95000,
      lastRepair: '2024-01-10',
      status: 'Active',
      repairHistory: [
        {
          id: 'REP-002',
          device: 'MacBook Pro',
          issue: 'Battery Issues',
          cost: 80000,
          date: '2024-01-10',
          status: 'Completed',
        },
      ],
    },
    {
      id: 'CUST-003',
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+234 803 456 7890',
      address: '789 Port Harcourt Street, GRA, Port Harcourt',
      dateJoined: '2024-01-16',
      totalRepairs: 1,
      totalSpent: 15000,
      lastRepair: '2024-01-16',
      status: 'Active',
      repairHistory: [
        {
          id: 'REP-003',
          device: 'iPad Air',
          issue: 'Charging Problems',
          cost: 15000,
          date: '2024-01-16',
          status: 'Pending',
        },
      ],
    },
  ]);

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleCreateCustomer = () => {
    const id = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    const customer: Customer = {
      ...newCustomer as Customer,
      id,
      dateJoined: new Date().toISOString().split('T')[0],
      totalRepairs: 0,
      totalSpent: 0,
      status: 'Active',
      repairHistory: [],
    };
    setCustomers([...customers, customer]);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
    setOpenDialog(false);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewMode('view');
    setOpenDialog(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNewCustomer(customer);
    setViewMode('edit');
    setOpenDialog(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'default';
  };

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
            {customer.name.split(' ').map(n => n.charAt(0)).join('')}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {customer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customer.id}
            </Typography>
            <Chip
              label={customer.status}
              color={getStatusColor(customer.status) as any}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>

        <List dense>
          <ListItem disablePadding>
            <ListItemAvatar>
              <Email color="action" fontSize="small" />
            </ListItemAvatar>
            <ListItemText
              primary={customer.email}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemAvatar>
              <Phone color="action" fontSize="small" />
            </ListItemAvatar>
            <ListItemText
              primary={customer.phone}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemAvatar>
              <LocationOn color="action" fontSize="small" />
            </ListItemAvatar>
            <ListItemText
              primary={customer.address}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Total Repairs
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {customer.totalRepairs}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Total Spent
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              ₦{customer.totalSpent.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => handleViewCustomer(customer)}
          >
            View
          </Button>
          {(user?.role === 'admin' || user?.role === 'technician') && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => handleEditCustomer(customer)}
            >
              Edit
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  if (user?.role === 'customer') {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomerCard customer={customers.find(c => c.email === user.email) || customers[0]} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setViewMode('create');
            setSelectedCustomer(null);
            setOpenDialog(true);
          }}
        >
          Add Customer
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Card View" />
            <Tab label="Table View" />
          </Tabs>
        </CardContent>
      </Card>

      {activeTab === 0 ? (
        <Grid container spacing={3}>
          {customers.map((customer) => (
            <Grid item xs={12} sm={6} md={4} key={customer.id}>
              <CustomerCard customer={customer} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Total Repairs</TableCell>
                    <TableCell>Total Spent</TableCell>
                    <TableCell>Last Repair</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            {customer.name.split(' ').map(n => n.charAt(0)).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {customer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {customer.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{customer.email}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {customer.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>{customer.totalRepairs}</TableCell>
                      <TableCell>₦{customer.totalSpent.toLocaleString()}</TableCell>
                      <TableCell>
                        {customer.lastRepair 
                          ? new Date(customer.lastRepair).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.status}
                          color={getStatusColor(customer.status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleViewCustomer(customer)}>
                            <Visibility />
                          </IconButton>
                          {(user?.role === 'admin' || user?.role === 'technician') && (
                            <IconButton size="small" onClick={() => handleEditCustomer(customer)}>
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
      )}

      {/* Customer Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode === 'create' ? 'Add New Customer' : 
           viewMode === 'edit' ? 'Edit Customer' : 'Customer Details'}
        </DialogTitle>
        <DialogContent>
          {viewMode === 'view' && selectedCustomer ? (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Person />
                      </ListItemAvatar>
                      <ListItemText primary="Name" secondary={selectedCustomer.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Email />
                      </ListItemAvatar>
                      <ListItemText primary="Email" secondary={selectedCustomer.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Phone />
                      </ListItemAvatar>
                      <ListItemText primary="Phone" secondary={selectedCustomer.phone} />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <LocationOn />
                      </ListItemAvatar>
                      <ListItemText primary="Address" secondary={selectedCustomer.address} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Account Summary</Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Customer ID" 
                        secondary={selectedCustomer.id} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Date Joined" 
                        secondary={new Date(selectedCustomer.dateJoined).toLocaleDateString()} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Total Repairs" 
                        secondary={selectedCustomer.totalRepairs} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Total Spent" 
                        secondary={`₦${selectedCustomer.totalSpent.toLocaleString()}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Status" 
                        secondary={
                          <Chip 
                            label={selectedCustomer.status} 
                            color={getStatusColor(selectedCustomer.status) as any}
                            size="small"
                          />
                        } 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Repair History</Typography>
                  <TableContainer component={Paper} elevation={0}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Request ID</TableCell>
                          <TableCell>Device</TableCell>
                          <TableCell>Issue</TableCell>
                          <TableCell>Cost</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedCustomer.repairHistory.map((repair) => (
                          <TableRow key={repair.id}>
                            <TableCell>{repair.id}</TableCell>
                            <TableCell>{repair.device}</TableCell>
                            <TableCell>{repair.issue}</TableCell>
                            <TableCell>₦{repair.cost.toLocaleString()}</TableCell>
                            <TableCell>{new Date(repair.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Chip label={repair.status} size="small" variant="outlined" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={newCustomer.name || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={newCustomer.email || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newCustomer.phone || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  disabled={viewMode === 'view'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={newCustomer.address || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
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
            <Button variant="contained" onClick={handleCreateCustomer}>
              Add Customer
            </Button>
          )}
          {viewMode === 'edit' && (
            <Button variant="contained" onClick={handleCreateCustomer}>
              Save Changes
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Customers;