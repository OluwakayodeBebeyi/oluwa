import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Phone, Computer, Smartphone } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  const demoAccounts = [
    { email: 'admin@jhobams.com', role: 'Admin', description: 'Full system access' },
    { email: 'tech@jhobams.com', role: 'Technician', description: 'Repair management' },
    { email: 'customer@example.com', role: 'Customer', description: 'Submit & track repairs' },
  ];

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', width: '100%', gap: 4 }}>
        {/* Company Info Section */}
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Jhobams Multiconcepts Limited
          </Typography>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Professional ICT Gadget Repair Services
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Our Services:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Smartphone color="primary" />
                <Typography>Smartphone & Tablet Repair</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Computer color="primary" />
                <Typography>Laptop & Desktop Services</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone color="primary" />
                <Typography>Network & Communication Devices</Typography>
              </Box>
            </Box>
          </Box>

          <Card sx={{ mt: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Why Choose Us?
              </Typography>
              <Typography variant="body2">
                • Expert technicians with years of experience<br />
                • Quick turnaround times<br />
                • Competitive pricing<br />
                • Warranty on all repairs<br />
                • Real-time repair tracking
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Login Form Section */}
        <Box sx={{ flex: 1, maxWidth: 500 }}>
          <Paper elevation={8} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
              Sign In
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
              Access your repair management dashboard
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Demo Accounts
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {demoAccounts.map((account, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('password123');
                  }}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {account.role}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {account.email} • {account.description}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>

            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 3 }}>
              Password for all demo accounts: <strong>password123</strong>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;