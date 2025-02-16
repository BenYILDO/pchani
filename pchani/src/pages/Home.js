import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useListing } from '../context/ListingContext';
import { categories } from '../constants';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  CardMedia,
  CardActionArea,
  useTheme,
  alpha,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Logo from '../components/Logo';
import ProductCard from '../components/ProductCard';

function Home() {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);
  const { listings, categoryStats } = useListing();
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    // Aktif ilanlardan en son eklenen 4 tanesini al
    const activeListings = listings
      .filter(listing => listing.status === 'active')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);

    setFeaturedListings(activeListings);
  }, [listings]); // listings değiştiğinde yeniden hesapla

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          py: 8,
          mb: 4,
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Logo variant="full" sx={{ mx: 'auto', mb: 4 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Türkiye'nin en büyük ikinci el bilgisayar parçaları platformu
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/post-listing"
              sx={{ px: 4, py: 1.5 }}
            >
              Hemen İlan Ver
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Vitrin Tabs */}
        <Paper 
          sx={{ 
            mb: 4,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
          }}
        >
          <Box sx={{ borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}` }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  px: 3,
                },
              }}
            >
              <Tab label="Anasayfa Vitrini" />
              <Tab label="Acil Acil" />
              <Tab label="Son 48 Saat / 1 Hafta / 1 Ay" />
              <Tab label="Yenilenmiş Ürünler" />
            </Tabs>
          </Box>

          {/* Featured Listings Grid */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {featuredListings.map((listing) => (
                <Grid item xs={12} sm={6} md={3} key={listing.id}>
                  <ProductCard listing={listing} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>

        {/* Categories */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'text.primary' }}>
          Kategoriler
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: alpha(theme.palette.common.white, 0.05),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.08),
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                  cursor: 'pointer',
                }}
                component={Link}
                to={`/products?category=${category.id}`}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                    {React.createElement(category.icon, { fontSize: 'large' })}
                  </Box>
                  <Typography gutterBottom variant="h6" component="h2">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {categoryStats[category.id] || 0} ilan
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Links */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            backgroundColor: alpha(theme.palette.common.white, 0.05),
          }}
        >
          <Typography variant="h6" gutterBottom color="text.primary">
            Hızlı Erişim
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 1 }}
                component={Link}
                to="/products"
              >
                Tüm İlanlar
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                component={Link}
                to="/post-listing"
              >
                İlan Ver
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                component={Link}
                to="/my-favorites"
              >
                Favorilerim
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                component={Link}
                to="/my-listings"
              >
                İlanlarım
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home; 