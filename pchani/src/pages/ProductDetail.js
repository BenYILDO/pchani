import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListing } from '../context/ListingContext';
import { conditions, deliveryTypes } from '../constants';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Star,
  Phone,
  Message,
  Favorite,
  Share,
  Report,
} from '@mui/icons-material';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListing, incrementViews, toggleFavorite, isFavorite } = useListing();
  const [listing, setListing] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const currentListing = getListing(parseInt(id));
    if (currentListing) {
      setListing(currentListing);
      setMainImage(currentListing.images[0]);
      setFavorite(isFavorite(currentListing.id));
      // Görüntülenme sayısını artır
      incrementViews(parseInt(id));
    } else {
      // İlan bulunamadıysa anasayfaya yönlendir
      navigate('/');
    }
  }, [id, getListing, incrementViews, navigate, isFavorite]);

  const handleFavoriteClick = async () => {
    const result = await toggleFavorite(listing.id);
    setFavorite(result);
  };

  if (!listing) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {listing && (
        <Grid container spacing={3}>
          {/* Left Column - Images */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box
                component="img"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 2,
                }}
                src={mainImage}
                alt={listing.title}
              />
              <Grid container spacing={1}>
                {listing.images.map((image, index) => (
                  <Grid item xs={3} key={index}>
                    <Box
                      component="img"
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: mainImage === image ? '2px solid #FFD700' : 'none',
                      }}
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      onClick={() => setMainImage(image)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Product Description */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Ürün Açıklaması
              </Typography>
              <Typography paragraph>{listing.description}</Typography>
            </Paper>

            {/* Product Specifications */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Teknik Özellikler
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Kategori"
                    secondary={listing.category}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Ürün Durumu"
                    secondary={conditions[listing.condition]}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Teslimat"
                    secondary={deliveryTypes[listing.deliveryType]}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Right Column - Product Info & Seller */}
          <Grid item xs={12} md={4}>
            {/* Product Info */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h4" gutterBottom>
                {listing.title}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                {listing.price.toLocaleString()} TL
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {listing.city} • {conditions[listing.condition]}
              </Typography>
              <Typography variant="body1" paragraph>
                {listing.description}
              </Typography>

              {/* Specifications */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Özellikler
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Teslimat
                    </Typography>
                    <Typography variant="body1">
                      {deliveryTypes[listing.deliveryType]}
                    </Typography>
                  </Grid>
                  {/* ... rest of specifications ... */}
                </Grid>
              </Paper>

              <Box sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1 }} /> {listing.city}, {listing.district}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ mr: 1 }} /> İlan Tarihi: {listing.createdAt}
                </Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ mb: 1 }}>
                <Phone sx={{ mr: 1 }} /> {listing.contactPhone}
              </Button>
              <Button variant="outlined" fullWidth>
                <Message sx={{ mr: 1 }} /> Mesaj Gönder
              </Button>
            </Paper>

            {/* Seller Info */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                <Box>
                  <Typography variant="h6">İlan Sahibi</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {listing.contactEmail}
                  </Typography>
                </Box>
              </Box>
              <Button variant="outlined" fullWidth>
                Satıcının Diğer İlanları
              </Button>
            </Paper>

            {/* Action Buttons */}
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    startIcon={<Favorite />}
                    onClick={handleFavoriteClick}
                    sx={{ 
                      color: favorite ? 'error.main' : 'text.secondary',
                      '&:hover': {
                        color: favorite ? 'error.dark' : 'error.light',
                      }
                    }}
                  >
                    {favorite ? 'Favorilerimde' : 'Favoriye Ekle'}
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    startIcon={<Share />}
                    sx={{ color: 'text.secondary' }}
                  >
                    Paylaş
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    startIcon={<Report />}
                    sx={{ color: 'error.main' }}
                  >
                    Şikayet
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default ProductDetail; 