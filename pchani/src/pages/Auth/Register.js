import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Apple,
} from '@mui/icons-material';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError('Lütfen kullanım koşullarını kabul edin.');
      return;
    }
    // TODO: Implement registration logic
    console.log('Register attempt with:', formData);
  };

  const handleSocialRegister = (provider) => {
    // TODO: Implement social registration
    console.log(`${provider} registration clicked`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Üye Ol
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="Ad"
              name="firstName"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Soyad"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-posta Adresi"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Telefon Numarası"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Şifre"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                <Link href="/terms" target="_blank">
                  Kullanım koşullarını
                </Link>{' '}
                okudum ve kabul ediyorum
              </Typography>
            }
            sx={{ mt: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Üye Ol
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>veya</Divider>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialRegister('Google')}
            sx={{ flex: 1, mr: 1 }}
          >
            Google ile Üye Ol
          </Button>
          <Button
            variant="outlined"
            startIcon={<Facebook />}
            onClick={() => handleSocialRegister('Facebook')}
            sx={{ flex: 1, mx: 1 }}
          >
            Facebook ile Üye Ol
          </Button>
          <Button
            variant="outlined"
            startIcon={<Apple />}
            onClick={() => handleSocialRegister('Apple')}
            sx={{ flex: 1, ml: 1 }}
          >
            Apple ile Üye Ol
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Zaten üye misiniz?{' '}
            <Link component={RouterLink} to="/login">
              Giriş Yapın
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register; 