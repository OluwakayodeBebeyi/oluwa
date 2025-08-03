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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Warning,
  CheckCircle,
  Remove,
  Memory,
  Battery,
  ScreenShare,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Screen' | 'Battery' | 'Motherboard' | 'Speaker' | 'Camera' | 'Charger' | 'Other';
  deviceType: 'Smartphone' | 'Tablet' | 'Laptop' | 'Desktop' | 'Universal';
  brand: string;
  model: string;
  quantity: number;
  minStockLevel: number;
  unitCost: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view' | 'restock'>('create');

  // Mock data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: 'INV-001',
      name: 'iPhone 13 Pro Screen Assembly',
      category: 'Screen',
      deviceType: 'Smartphone',
      brand: 'Apple',
      model: 'iPhone 13 Pro',
      quantity: 15,
      minStockLevel: 5,
      unitCost: 25000,
      supplier: 'TechParts Nigeria',
      location: 'Shelf A-1',
      lastRestocked: '2024-01-10',
      status: 'In Stock',
    },
    {
      id: 'INV-002',
      name: 'MacBook Pro Battery',
      category: 'Battery',
      deviceType: 'Laptop',
      brand: 'Apple',
      model: 'MacBook Pro 2021',
      quantity: 3,
      minStockLevel: 5,
      unitCost: 45000,
      supplier: 'Lagos Electronics',
      location: 'Shelf B-2',
      lastRestocked: '2024-01-05',
      status: 'Low Stock',
    },
    {
      id: 'INV-003',
      name: 'Samsung Galaxy S21 Camera Module',
      category: 'Camera',
      deviceType: 'Smartphone',
      brand: 'Samsung',
      model: 'Galaxy S21',
      quantity: 0,
      minStockLevel: 3,
      unitCost: 18000,
      supplier: 'Mobile Parts Hub',
      location: 'Shelf A-3',
      lastRestocked: '2023-12-20',
      status: 'Out of Stock',
    },
    {
      id: 'INV-004',
      name: 'Universal USB-C Charger',
      category: 'Charger',
      deviceType: 'Universal',
      brand: 'Generic',
      model: 'Universal',
      quantity: 25,
      minStockLevel: 10,
      unitCost: 3500,
      supplier: 'Accessory World',
      location: 'Shelf C-1',
      lastRestocked: '2024-01-15',
      status: 'In Stock',
    },
  ]);

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'Other',
    deviceType: 'Universal',
    brand: '',
    model: '',
    quantity: 0,
    minStockLevel: 5,
    unitCost: 0,
    supplier: '',
    location: '',
  });

  const [restockQuantity, setRestockQuantity] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'error';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Screen': return <ScreenShare />;
      case 'Battery': return <Battery />;
      case 'Motherboard': return <Memory />;
      default: return <Memory />;
    }
  };

  const updateItemStatus = (item: InventoryItem): InventoryItem => {
    let status: InventoryItem['status'];
    if (item.quantity === 0) {
      status = 'Out of Stock';
    } else if (item.quantity <= item.minStockLevel) {
      status = 'Low Stock';
    } else {
      status = 'In Stock';
    }
    return { ...item, status };
  };

  const handleCreateItem = () => {
    const id = `INV-${String(inventoryItems.length + 1).padStart(3, '0')}`;
    const item: InventoryItem = {
      ...newItem as InventoryItem,
      id,
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    const updatedItem = updateItemStatus(item);
    setInventoryItems([...inventoryItems, updatedItem]);
    setNewItem({
      name: '',
      category: 'Other',
      deviceType: 'Universal',
      brand: '',
      model: '',
      quantity: 0,
      minStockLevel: 5,
      unitCost: 0,
      supplier: '',
      location: '',
    });
    setOpenDialog(false);
  };

  const handleRestock = () => {
    if (selectedItem && restockQuantity > 0) {
      const updatedItems = inventoryItems.map(item => {
        if (item.id === selectedItem.id) {
          const newQuantity = item.quantity + restockQuantity;
          return updateItemStatus({
            ...item,
            quantity: newQuantity,
            lastRestocked: new Date().toISOString().split('T')[0],
          });
        }
        return item;
      });
      setInventoryItems(updatedItems);
      setRestockQuantity(0);
      setOpenDialog(false);
    }
  };

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setViewMode('view');
    setOpenDialog(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setNewItem(item);
    setViewMode('edit');
    setOpenDialog(true);
  };

  const handleRestockItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setViewMode('restock');
    setRestockQuantity(item.minStockLevel);
    setOpenDialog(true);
  };

  const lowStockItems = inventoryItems.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock');
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Inventory Management
        </Typography>
        {(user?.role === 'admin' || user?.role === 'technician') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setViewMode('create');
              setSelectedItem(null);
              setOpenDialog(true);
            }}
          >
            Add Item
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Items
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {inventoryItems.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56 }}>
                  <Memory />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Low Stock Alerts
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {lowStockItems.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main', width: 56, height: 56 }}>
                  <Warning />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Value
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    ₦{totalValue.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main', width: 56, height: 56 }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Quantity
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {inventoryItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 56, height: 56 }}>
                  <Battery />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {lowStockItems.length} item(s) require attention
          </Typography>
          <Typography variant="body2">
            {lowStockItems.map(item => item.name).join(', ')} - Please restock soon
          </Typography>
        </Alert>
      )}

      {/* Inventory Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand/Model</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Cost</TableCell>
                  <TableCell>Total Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                          {getCategoryIcon(item.category)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={item.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.brand}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.model}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {item.quantity}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Min: {item.minStockLevel}
                      </Typography>
                    </TableCell>
                    <TableCell>₦{item.unitCost.toLocaleString()}</TableCell>
                    <TableCell>₦{(item.quantity * item.unitCost).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={getStatusColor(item.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewItem(item)}>
                          <Visibility />
                        </IconButton>
                        {(user?.role === 'admin' || user?.role === 'technician') && (
                          <>
                            <IconButton size="small" onClick={() => handleEditItem(item)}>
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleRestockItem(item)}
                              color="primary"
                            >
                              <Add />
                            </IconButton>
                          </>
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

      {/* Item Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {viewMode === 'create' ? 'Add New Item' : 
           viewMode === 'edit' ? 'Edit Item' : 
           viewMode === 'restock' ? 'Restock Item' : 'Item Details'}
        </DialogTitle>
        <DialogContent>
          {viewMode === 'view' && selectedItem ? (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Item Information</Typography>
                <Typography variant="body2"><strong>Name:</strong> {selectedItem.name}</Typography>
                <Typography variant="body2"><strong>ID:</strong> {selectedItem.id}</Typography>
                <Typography variant="body2"><strong>Category:</strong> {selectedItem.category}</Typography>
                <Typography variant="body2"><strong>Device Type:</strong> {selectedItem.deviceType}</Typography>
                <Typography variant="body2"><strong>Brand:</strong> {selectedItem.brand}</Typography>
                <Typography variant="body2"><strong>Model:</strong> {selectedItem.model}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Stock Information</Typography>
                <Typography variant="body2"><strong>Current Quantity:</strong> {selectedItem.quantity}</Typography>
                <Typography variant="body2"><strong>Minimum Stock Level:</strong> {selectedItem.minStockLevel}</Typography>
                <Typography variant="body2"><strong>Unit Cost:</strong> ₦{selectedItem.unitCost.toLocaleString()}</Typography>
                <Typography variant="body2"><strong>Total Value:</strong> ₦{(selectedItem.quantity * selectedItem.unitCost).toLocaleString()}</Typography>
                <Typography variant="body2"><strong>Status:</strong> 
                  <Chip 
                    label={selectedItem.status} 
                    color={getStatusColor(selectedItem.status) as any}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Additional Details</Typography>
                <Typography variant="body2"><strong>Supplier:</strong> {selectedItem.supplier}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {selectedItem.location}</Typography>
                <Typography variant="body2"><strong>Last Restocked:</strong> {new Date(selectedItem.lastRestocked).toLocaleDateString()}</Typography>
              </Grid>
            </Grid>
          ) : viewMode === 'restock' && selectedItem ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Restock: {selectedItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Current quantity: {selectedItem.quantity} | Minimum stock level: {selectedItem.minStockLevel}
              </Typography>
              <TextField
                fullWidth
                label="Quantity to Add"
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2">
                New quantity will be: <strong>{selectedItem.quantity + restockQuantity}</strong>
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Item Name"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newItem.category || 'Other'}
                    label="Category"
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                  >
                    <MenuItem value="Screen">Screen</MenuItem>
                    <MenuItem value="Battery">Battery</MenuItem>
                    <MenuItem value="Motherboard">Motherboard</MenuItem>
                    <MenuItem value="Speaker">Speaker</MenuItem>
                    <MenuItem value="Camera">Camera</MenuItem>
                    <MenuItem value="Charger">Charger</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Device Type</InputLabel>
                  <Select
                    value={newItem.deviceType || 'Universal'}
                    label="Device Type"
                    onChange={(e) => setNewItem({ ...newItem, deviceType: e.target.value as any })}
                  >
                    <MenuItem value="Smartphone">Smartphone</MenuItem>
                    <MenuItem value="Tablet">Tablet</MenuItem>
                    <MenuItem value="Laptop">Laptop</MenuItem>
                    <MenuItem value="Desktop">Desktop</MenuItem>
                    <MenuItem value="Universal">Universal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={newItem.brand || ''}
                  onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Model"
                  value={newItem.model || ''}
                  onChange={(e) => setNewItem({ ...newItem, model: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Initial Quantity"
                  type="number"
                  value={newItem.quantity || 0}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Stock Level"
                  type="number"
                  value={newItem.minStockLevel || 5}
                  onChange={(e) => setNewItem({ ...newItem, minStockLevel: parseInt(e.target.value) || 5 })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unit Cost (₦)"
                  type="number"
                  value={newItem.unitCost || 0}
                  onChange={(e) => setNewItem({ ...newItem, unitCost: parseInt(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Supplier"
                  value={newItem.supplier || ''}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Storage Location"
                  value={newItem.location || ''}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="e.g., Shelf A-1, Room 2, etc."
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
            <Button variant="contained" onClick={handleCreateItem}>
              Add Item
            </Button>
          )}
          {viewMode === 'edit' && (
            <Button variant="contained" onClick={handleCreateItem}>
              Save Changes
            </Button>
          )}
          {viewMode === 'restock' && (
            <Button variant="contained" onClick={handleRestock}>
              Restock
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Inventory;