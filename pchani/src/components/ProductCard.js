import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardMedia,
  CardActionArea,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useListing } from '../context/ListingContext';
import FavoriteListDialog from './FavoriteListDialog';

const ProductCard = ({ listing }) => {
  const theme = useTheme();
  const { toggleFavorite, isFavorite } = useListing();
  const [favorite, setFavorite] = useState(isFavorite(listing.id));
  const [showFavoriteDialog, setShowFavoriteDialog] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Link'e tıklamayı engelle
    const result = await toggleFavorite(listing.id);
    setFavorite(result);
    setShowFavoriteDialog(result); // Eğer favoriye eklendiyse dialog'u göster
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          position: 'relative',
          backgroundColor: alpha(theme.palette.common.white, 0.05),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.08),
          }
        }}
      >
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            color: favorite ? 'error.main' : 'grey.500',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>

        <CardActionArea component={Link} to={`/product/${listing.id}`}>
          {listing.isSponsored && (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                zIndex: 1,
              }}
            >
              Öne Çıkan
            </Box>
          )}
          <CardMedia
            component="img"
            height="160"
            image={listing.image}
            alt={listing.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2" noWrap>
              {listing.title}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {listing.price.toLocaleString()} TL
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {listing.city}, {listing.district}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {listing.createdAt}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      <FavoriteListDialog
        open={showFavoriteDialog}
        onClose={() => setShowFavoriteDialog(false)}
        listingId={listing.id}
      />
    </>
  );
};

export default ProductCard; 