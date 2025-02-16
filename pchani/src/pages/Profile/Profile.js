import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useListing } from '../../context/ListingContext';
import ProductCard from '../../components/ProductCard';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';

const Profile = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { getUserListings, getFavoriteListings } = useListing();
  
  const userListings = getUserListings(user?.id);
  const favoriteListings = getFavoriteListings();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profil Bilgileri */}
      <Paper 
        sx={{ 
          p: 3,
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={user?.avatar}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h6">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Button
                variant="outlined"
                component={Link}
                to="/profile/edit"
                sx={{ mt: 2 }}
              >
                Profili Düzenle
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <StarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">{userListings.length}</Typography>
                  <Typography color="text.secondary">Aktif İlan</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                  <Typography variant="h6">{favoriteListings.length}</Typography>
                  <Typography color="text.secondary">Favori</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                  }}
                >
                  <MessageIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h6">0</Typography>
                  <Typography color="text.secondary">Mesaj</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Son İlanlarım */}
      <Paper 
        sx={{ 
          p: 3,
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Son İlanlarım</Typography>
          <Button component={Link} to="/my-listings">Tümünü Gör</Button>
        </Box>
        <Grid container spacing={3}>
          {userListings.slice(0, 3).map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <ProductCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Favorilerim */}
      <Paper 
        sx={{ 
          p: 3,
          mb: 4,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Favorilerim</Typography>
          <Button component={Link} to="/my-favorites">Tümünü Gör</Button>
        </Box>
        <Grid container spacing={3}>
          {favoriteListings.slice(0, 3).map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <ProductCard listing={listing} />
            </Grid>
          ))}
          {favoriteListings.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  Henüz favori ilanınız bulunmuyor.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 