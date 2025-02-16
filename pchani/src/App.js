import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ListingProvider } from './context/ListingContext';
import { MessageProvider } from './context/MessageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CreateListing from './pages/Listing/CreateListing';
import EditListing from './pages/Listing/EditListing';
import Profile from './pages/Profile/Profile';
import Messages from './pages/Messages/Messages';
import Favorites from './pages/Profile/Favorites';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF3B30', // Logodaki kırmızı renk
    },
    secondary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

// Örnek kullanıcı bilgileri
const mockUser = {
  email: 'test@example.com',
  password: 'test123',
  firstName: 'Test',
  lastName: 'User'
};

// Simüle edilmiş auth durumu - daha sonra gerçek auth sistemi ile değiştirilecek
const isAuthenticated = true;

// Korumalı route bileşeni
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ListingProvider>
        <MessageProvider>
          <ThemeProvider theme={theme}>
            <Router>
              <Box 
                sx={{ 
                  bgcolor: 'background.default',
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Navbar />
                <Box sx={{ flex: 1 }}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                      path="/post-listing"
                      element={
                        <ProtectedRoute>
                          <CreateListing />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/edit-listing/:id"
                      element={
                        <ProtectedRoute>
                          <EditListing />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-listings"
                      element={
                        <ProtectedRoute>
                          <div>İlanlarım Sayfası</div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-favorites"
                      element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/messages"
                      element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <div>Bildirimlerim Sayfası</div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Page */}
                    <Route path="*" element={<div>404 - Sayfa Bulunamadı</div>} />
                  </Routes>
                </Box>
              </Box>
            </Router>
          </ThemeProvider>
        </MessageProvider>
      </ListingProvider>
    </AuthProvider>
  );
}

export default App; 